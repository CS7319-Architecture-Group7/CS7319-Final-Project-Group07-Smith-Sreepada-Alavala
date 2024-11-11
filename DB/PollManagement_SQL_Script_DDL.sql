-- Disable warnings
SET sql_notes = 0;

-- Create a new database user
-- Create user if not exists
CREATE USER IF NOT EXISTS 'cs7319'@'localhost' IDENTIFIED BY 'archproject123';

-- Create the PollManagement database if not exists
CREATE DATABASE IF NOT EXISTS PollManagement;

-- Grant permissions to the cs7319 user on the PollManagement database
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON PollManagement.* TO 'cs7319'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- Use the PollManagement database
USE PollManagement;

-- Create User Table if not exists
CREATE TABLE IF NOT EXISTS User (
    UserId BIGINT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(200) NOT NULL,
    LastName VARCHAR(200) NOT NULL,
    EmailID VARCHAR(200) NOT NULL UNIQUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (EmailID)
);

-- Create PassCode Table if not exists
CREATE TABLE IF NOT EXISTS PassCode (
    PassCodeId BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserId BIGINT,
    Code VARCHAR(8) NOT NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ExpirationDateTime DATETIME NOT NULL,    
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE SET NULL,
    INDEX idx_passcode_user (UserId),
    INDEX idx_passcode_user_expiration (UserId, ExpirationDateTime),
    INDEX idx_passcode_user_code_expiration (UserId, Code, ExpirationDateTime)
);

-- Create Poll Table if not exists
CREATE TABLE IF NOT EXISTS Poll (
    PollId BIGINT AUTO_INCREMENT PRIMARY KEY,
    QuestionText TEXT NOT NULL,
    UserId BIGINT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    BeginDateTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    ExpirationDateTime DATETIME NOT NULL,
    ResultsVisible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE SET NULL,
    INDEX idx_poll_createdby (UserId),
    INDEX idx_poll_expiration (ExpirationDateTime)
);

-- Create PollOption Table if not exists
CREATE TABLE IF NOT EXISTS PollOption (
    PollOptionId BIGINT AUTO_INCREMENT PRIMARY KEY,
    PollId BIGINT,
    OptionText VARCHAR(255) NOT NULL,
    UNIQUE (PollId, PollOptionId),
    FOREIGN KEY (PollId) REFERENCES Poll(PollId) ON DELETE RESTRICT,
    INDEX idx_polloption_pollid_optiontext (PollId, OptionText),
    INDEX idx_polloption_pollid (PollId)
);

-- Create PollAnswer Table if not exists
CREATE TABLE IF NOT EXISTS PollAnswer (
    PollAnswerId BIGINT AUTO_INCREMENT PRIMARY KEY,
    PollId BIGINT,
    OptionId BIGINT,
    UserId BIGINT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (PollId, OptionId, UserId),
    FOREIGN KEY (PollId) REFERENCES Poll(PollId) ON DELETE RESTRICT,
    FOREIGN KEY (OptionId) REFERENCES PollOption(PollOptionId) ON DELETE RESTRICT,
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE RESTRICT,
    INDEX idx_pollanswer_user (UserId),
    INDEX idx_pollanswer_pollid (PollId)
);

-- Create Comment Table if not exists
CREATE TABLE IF NOT EXISTS Comment (
    CommentId BIGINT AUTO_INCREMENT PRIMARY KEY,
    PollId BIGINT,
    UserId BIGINT,
    Content TEXT NOT NULL,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PollId) REFERENCES Poll(PollId) ON DELETE RESTRICT,
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE RESTRICT,
    INDEX idx_comment_createdby (UserId),
    INDEX idx_comment_pollid (PollId)
);

-- Performance Logs
CREATE TABLE Performance (
    Id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Level VARCHAR(16) NOT NULL,
    Metadata VARCHAR(2048) NOT NULL,
    Message VARCHAR(2048) NOT NULL,
    AddDate DATETIME NOT NULL
);
