USE vite_gourmand;

ALTER TABLE user
ADD COLUMN actif BOOLEAN DEFAULT true 
AFTER role_id; 