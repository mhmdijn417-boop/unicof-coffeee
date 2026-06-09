-- Skema akun pengguna dan penyimpanan data user untuk web Unicof Coffee

CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  is_active BOOLEAN NOT NULL DEFAULT 1,
  role TEXT NOT NULL DEFAULT 'user',
  preferences JSON
);

CREATE TABLE IF NOT EXISTS user_profiles (
  profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  birthdate DATE,
  gender TEXT,
  loyalty_points INTEGER DEFAULT 0,
  favorite_menu TEXT,
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Contoh query registrasi akun baru
INSERT INTO users (username, email, password_hash, full_name, phone, address, role)
VALUES ('nama_pengguna', 'email@example.com', 'hashed_password', 'Nama Lengkap', '08123456789', 'Alamat lengkap', 'user');

-- Contoh query login berdasarkan username atau email
SELECT user_id, username, email, password_hash, full_name, is_active
FROM users
WHERE (username = 'input_username' OR email = 'input_username') AND is_active = 1;

-- Contoh update kata sandi
UPDATE users
SET password_hash = 'new_hashed_password', updated_at = CURRENT_TIMESTAMP
WHERE user_id = 123;

-- Contoh update profil user
UPDATE users
SET full_name = 'Nama Baru', phone = '08987654321', address = 'Alamat baru', updated_at = CURRENT_TIMESTAMP
WHERE user_id = 123;

-- Contoh simpan preferensi pengguna dengan JSON
UPDATE users
SET preferences = json_object('theme','dark','language','id')
WHERE user_id = 123;
