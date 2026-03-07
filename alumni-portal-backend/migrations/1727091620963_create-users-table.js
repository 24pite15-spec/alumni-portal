exports.up = (pgm) => {
    pgm.createTable('users', {
      id: 'id',
      name: { type: 'varchar(100)', notNull: true },
      email: { type: 'varchar(100)', unique: true, notNull: true },
      created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
      updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('users');
  };
  