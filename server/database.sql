CREATE TABLE User (
	uuid VARCHAR(36) PRIMARY KEY,
	username VARCHAR(40) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password TEXT NOT NULL,
	description TEXT,
	profile_picture VARCHAR(2083),
    registered DATETIME,
    last_login DATETIME,
  UNIQUE KEY (username)
);

CREATE TABLE IF NOT EXISTS `people` (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  active BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8;