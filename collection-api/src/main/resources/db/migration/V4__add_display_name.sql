ALTER TABLE users ADD COLUMN display_name VARCHAR(255) NOT NULL DEFAULT '';
UPDATE users SET display_name = split_part(email, '@', 1) WHERE display_name = '';
