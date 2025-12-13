// Script d'export MySQL vers PostgreSQL
// Ce script exporte toutes les données de MySQL locale vers un fichier SQL PostgreSQL

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuration de connexion MySQL (locale)
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'vite_gourmand',
  port: process.env.DB_PORT || 3306
};

// Ordre d'export des tables (respecter les dépendances)
const tablesOrder = [
  'role',
  'user',  // Mot réservé PostgreSQL, nécessite des guillemets
  'regime',
  'theme',
  'allergene',
  'plat',
  'menu',
  'plat_allergene',
  'plat_menu',
  'commande',
  'commande_menu',
  'avis',
  'password_reset_tokens',
  'commande_statut_history'
];

// Tables qui nécessitent des guillemets (mots réservés PostgreSQL)
const quotedTables = ['user'];

// Fonction pour échapper les valeurs SQL
function escapeValue(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  // Échapper les apostrophes pour PostgreSQL
  return `'${String(value).replace(/'/g, "''")}'`;
}

// Fonction pour convertir les valeurs MySQL en PostgreSQL
function convertValue(value, columnType) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  
  // Conversion des booléens
  if (columnType.includes('tinyint(1)') || columnType === 'BOOLEAN') {
    return value ? 'TRUE' : 'FALSE';
  }
  
  // Conversion des dates DATETIME/TIMESTAMP -> format PostgreSQL
  if (columnType.includes('datetime') || columnType.includes('timestamp') || columnType.includes('date')) {
    if (value) {
      // Si c'est déjà une date JavaScript
      if (value instanceof Date) {
        // Format: YYYY-MM-DD HH:MM:SS
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        const hours = String(value.getHours()).padStart(2, '0');
        const minutes = String(value.getMinutes()).padStart(2, '0');
        const seconds = String(value.getSeconds()).padStart(2, '0');
        
        if (columnType.includes('date') && !columnType.includes('datetime') && !columnType.includes('timestamp')) {
          // Pour DATE uniquement
          return `'${year}-${month}-${day}'::date`;
        } else {
          // Pour DATETIME/TIMESTAMP
          return `'${year}-${month}-${day} ${hours}:${minutes}:${seconds}'::timestamp`;
        }
      }
      // Si c'est une chaîne de caractères (format MySQL)
      else if (typeof value === 'string') {
        // Essayer de parser la date
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          
          if (columnType.includes('date') && !columnType.includes('datetime') && !columnType.includes('timestamp')) {
            // Pour DATE uniquement (format YYYY-MM-DD)
            return `'${year}-${month}-${day}'::date`;
          } else {
            // Pour DATETIME/TIMESTAMP (format YYYY-MM-DD HH:MM:SS)
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `'${year}-${month}-${day} ${hours}:${minutes}:${seconds}'::timestamp`;
          }
        }
      }
      // Si on ne peut pas parser, retourner tel quel (peut causer une erreur)
      return escapeValue(value);
    }
    return 'NULL';
  }
  
  return escapeValue(value);
}

// Fonction pour obtenir les colonnes d'une table
async function getTableColumns(connection, tableName) {
  const [columns] = await connection.query(`DESCRIBE ${tableName}`);
  return columns;
}

// Fonction pour exporter une table
async function exportTable(connection, tableName) {
  console.log(`📦 Export de la table: ${tableName}...`);
  
  try {
    // Récupérer les colonnes
    const columns = await getTableColumns(connection, tableName);
    const columnNames = columns.map(col => col.Field);
    
    // Récupérer les données
    const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
    
    if (rows.length === 0) {
      console.log(`   ⚠️  Table ${tableName} est vide`);
      return `-- Table ${tableName} est vide\n`;
    }
    
    console.log(`   ✅ ${rows.length} lignes trouvées`);
    
    // Générer les INSERT
    let sql = `\n-- Export de la table ${tableName}\n`;
    sql += `-- ${rows.length} lignes\n\n`;
    
    // Pour PostgreSQL, on utilise ON CONFLICT DO NOTHING pour éviter les doublons
    for (const row of rows) {
      const values = columnNames.map(colName => {
        const column = columns.find(c => c.Field === colName);
        return convertValue(row[colName], column.Type);
      });
      
      // Mettre des guillemets autour du nom de table si c'est un mot réservé
      const quotedTableName = quotedTables.includes(tableName) ? `"${tableName}"` : tableName;
      sql += `INSERT INTO ${quotedTableName} (${columnNames.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;\n`;
    }
    
    sql += '\n';
    return sql;
    
  } catch (error) {
    console.error(`   ❌ Erreur lors de l'export de ${tableName}:`, error.message);
    return `-- Erreur lors de l'export de ${tableName}: ${error.message}\n\n`;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage de l\'export MySQL → PostgreSQL\n');
  console.log('Configuration MySQL:');
  console.log(`  Host: ${mysqlConfig.host}`);
  console.log(`  Database: ${mysqlConfig.database}`);
  console.log(`  User: ${mysqlConfig.user}\n`);
  
  let connection;
  
  try {
    // Connexion à MySQL
    console.log('📡 Connexion à MySQL...');
    connection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Connecté à MySQL\n');
    
    // Générer le fichier SQL
    let sqlContent = `-- Export MySQL vers PostgreSQL
-- Généré le: ${new Date().toISOString()}
-- Base de données source: ${mysqlConfig.database}
-- 
-- IMPORTANT: 
-- 1. Assurez-vous que les tables existent déjà dans Supabase
-- 2. Exécutez ce script dans Supabase SQL Editor
-- 3. Les INSERT utilisent ON CONFLICT DO NOTHING pour éviter les doublons
--

BEGIN;

`;

    // Exporter chaque table dans l'ordre
    for (const tableName of tablesOrder) {
      try {
        // Vérifier que la table existe (sans guillemets pour MySQL)
        const [tables] = await connection.query(
          `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`,
          [mysqlConfig.database, tableName]
        );
        
        if (tables[0].count > 0) {
          const tableSQL = await exportTable(connection, tableName);
          sqlContent += tableSQL;
        } else {
          console.log(`   ⚠️  Table ${tableName} n'existe pas, ignorée`);
          sqlContent += `-- Table ${tableName} n'existe pas\n\n`;
        }
      } catch (error) {
        console.error(`   ❌ Erreur avec la table ${tableName}:`, error.message);
        sqlContent += `-- Erreur avec la table ${tableName}: ${error.message}\n\n`;
      }
    }
    
    sqlContent += `COMMIT;

-- Export terminé
-- Vérifiez les données dans Supabase Table Editor
`;

    // Sauvegarder le fichier
    const outputPath = path.join(__dirname, '..', 'back', 'mysql_data', 'export-postgresql-data.sql');
    fs.writeFileSync(outputPath, sqlContent, 'utf8');
    
    console.log('\n✅ Export terminé avec succès !');
    console.log(`📄 Fichier généré: ${outputPath}`);
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Ouvrez Supabase Dashboard → SQL Editor');
    console.log('2. Ouvrez le fichier export-postgresql-data.sql');
    console.log('3. Copiez tout le contenu');
    console.log('4. Collez dans l\'éditeur SQL de Supabase');
    console.log('5. Cliquez sur "Run"');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'export:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion MySQL fermée');
    }
  }
}

// Exécuter le script
main().catch(console.error);

