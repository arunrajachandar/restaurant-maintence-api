const sqlite = require('sqlite3');

const database = new sqlite.Database('./database.sqlite');

database.serialize(function(){
    database.run('CREATE TABLE IF NOT EXISTS `Employee` ( ' +
    '`id` INTEGER NOT NULL, ' +
    '`name` TEXT NOT NULL, ' +
    '`position` TEXT NOT NULL, ' +
    '`wage` TEXT NOT NULL, ' +
    '`is_current_employee` INTEGER NOT NULL DEFAULT 1, ' +
    'PRIMARY KEY(`id`) )');
    database.run('CREATE TABLE IF NOT EXISTS `Timesheet` ( ' +
    '`id` INTEGER NOT NULL, ' +
    '`hours` INTEGER NOT NULL, ' +
    '`rate` INTEGER NOT NULL, '+ 
    '`date` INTEGER NOT NULL, '+ 
    '`employee_id` INTEGER NOT NULL, '+ 
    'PRIMARY KEY(`id`) '+
    'FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`)) ');
    database.run('CREATE TABLE IF NOT EXISTS `Menu` ( ' +
    '`id` INTEGER NOT NULL, ' +
    '`title` TEXT NOT NULL, ' +
    'PRIMARY KEY(`id`) )');
    database.run('CREATE TABLE IF NOT EXISTS `MenuItem` ( ' +
    '`id` INTEGER NOT NULL, ' +
    '`name` TEXT NOT NULL, ' +
    '`description` INTEGER, '+ 
    '`inventory` INTEGER NOT NULL, '+ 
    '`price` INTEGER NOT NULL, '+ 
    '`menu_id` INTEGER NOT NULL, '+ 
    'PRIMARY KEY(`id`), '+
    'FOREIGN KEY (`menu_id`) REFERENCES `Menu`(`id`)) ');
})
