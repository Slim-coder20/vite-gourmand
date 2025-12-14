// Test simple pour vérifier que Vercel détecte les fonctions serverless
module.exports = async (req, res) => {
  console.log("🚀 Test handler appelé");
  res.json({ 
    message: "Test handler fonctionne",
    url: req.url,
    method: req.method 
  });
};

