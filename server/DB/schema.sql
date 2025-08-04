
use guest_room_booking;

CREATE TABLE house_owner (
    owner_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile_num VARCHAR(15) NOT NULL,
    permanent_address TEXT NOT NULL,
    temp_address TEXT,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE house_details (
    house_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    house_name VARCHAR(100) NOT NULL,
    total_rooms INT NOT NULL,
    house_location TEXT NOT NULL,
    availability BOOLEAN DEFAULT TRUE,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES house_owner(owner_id) ON DELETE CASCADE
);

CREATE TABLE room_details (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    house_id INT NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    floor_size DECIMAL(10,2) NOT NULL COMMENT 'in square feet/meters',
    num_of_beds INT NOT NULL,
    has_wifi BOOLEAN DEFAULT FALSE,
    has_tv BOOLEAN DEFAULT FALSE,
    has_ac BOOLEAN DEFAULT FALSE,
    has_heating BOOLEAN DEFAULT FALSE,
    has_private_bathroom BOOLEAN DEFAULT FALSE,
    has_balcony BOOLEAN DEFAULT FALSE,
    has_workspace BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES house_owner(owner_id) ON DELETE CASCADE,
    FOREIGN KEY (house_id) REFERENCES house_details(house_id) ON DELETE CASCADE
);

CREATE TABLE room_pictures (
    picture_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    picture VARCHAR(255) NOT NULL COMMENT 'Path to the image file',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES room_details(room_id) ON DELETE CASCADE
);

ALTER TABLE room_details 
ADD COLUMN room_picture VARCHAR(255) AFTER room_name;

CREATE TABLE room_booking_details (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    house_id INT NOT NULL,
    room_id INT NOT NULL,
    availability ENUM('available', 'not available') NOT NULL DEFAULT 'available',
    from_date DATE,
    to_date DATE,
    from_time TIME,
    to_time TIME,
    rent_amount_per_day DECIMAL(10, 2),
    minimum_booking_period INT COMMENT 'Minimum booking period in days',
    maximum_booking_period INT COMMENT 'Maximum booking period in days',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES house_owner(owner_id) ON DELETE CASCADE,
    FOREIGN KEY (house_id) REFERENCES house_details(house_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES room_details(room_id) ON DELETE CASCADE
    );


CREATE TABLE customers (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    mobile_num VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);