import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { table } from 'console';
dotenv.config();

const PG_URL = process.env.PG_URL_STARWARS;

const pg = new Pool({ connectionString: PG_URL });

interface schemaControllers {
  getSchema: RequestHandler;
  getQueryResults: RequestHandler;
}
function currentColumnHasPrimaryKey(
  tableRelationships: any,
  currentTableName: any,
  currentColumnName: any
): boolean {
  return (
    tableRelationships.table_name === currentTableName &&
    tableRelationships.column_name === currentColumnName &&
    tableRelationships.constraint_type === 'PRIMARY KEY'
  );
}
function currentColumnHasForeignKey(
  tableRelationships: any,
  currentTableName: any,
  currentColumnName: any
): boolean {
  return (
    tableRelationships.table_name === currentTableName &&
    tableRelationships.column_name === currentColumnName &&
    tableRelationships.constraint_type === 'FOREIGN KEY'
  );
}
const schemaController: schemaControllers = {
  getSchema: async (req, res, next) => {
    try {
      const { query } = req.body;
      // Get all relationships between all tables
      const relationships = await pg.query(`
      select tc.table_name, kc.column_name, tc.constraint_type, cc.table_name as table_origin, cc.column_name as table_column
      from information_schema.key_column_usage kc

      join information_schema.table_constraints tc
      on kc.table_name = tc.table_name and kc.table_schema = tc.table_schema and kc.constraint_name = tc.constraint_name

      left join information_schema.constraint_column_usage cc
      on cc.constraint_name = kc.constraint_name and tc.constraint_type = 'FOREIGN KEY'

      where tc.constraint_type = 'PRIMARY KEY' or tc.constraint_type = 'FOREIGN KEY'
      order by tc.table_name;
      `);
      // Get all the tables in schema
      const table_names = await pg.query(
        `SELECT table_name FROM information_schema.tables
         WHERE table_type = 'BASE TABLE'
         AND table_schema = 'public'`
      );
      // Loop through each table object
      for (let i = 0; i < table_names.rows.length; i++) {
        const currentTableName = table_names.rows[i].table_name;
        const currentTable = table_names.rows[i];
        // Initialize array to hold objects that represent each column for the table
        currentTable.columns = [];

        // Get all columns of current table
        const getColumns = await pg.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = '${currentTableName}';`);

        // Build each column object by assigning the data type and relationships
        for (let i = 0; i < getColumns.rows.length; i++) {
          const columnObj: Record<string, any> = {};
          const columns = getColumns.rows[i];
          const columnName = columns.column_name;
          const columnDataType = columns.data_type;

          columnObj[columnName] = columnDataType;

          // Iterate through relationships object and check if the the current Column has a primary key or foreign key
          for (let i = 0; i < relationships.rows.length; i++) {
            const tableRelationship = relationships.rows[i];
            // prettier-ignore
            {
                if (currentColumnHasPrimaryKey(tableRelationship,currentTableName,columnName)) {
                columnObj.primaryKey = true;
                break;
              } else if (currentColumnHasForeignKey(tableRelationship,currentTableName,columnName)) {
                columnObj.linkedTable = tableRelationship.table_origin + '.' +tableRelationship.table_column;
                break;
              }
            }
          }
          currentTable.columns.push(columnObj);
        }
      }

      res.json(table_names.rows);
      // query DB
    } catch (error) {
      return next({
        log: `Error in schemaController.getSchema ${error}`,
        status: 400,
        message: { error },
      });
    }
  },
  getQueryResults: async (req, res, next) => {},
};

export default schemaController;

const objbjj = {
  table_name: 'films',
  column_name: '_id',
  constraint_type: 'PRIMARY KEY',
  table_origin: null,
  table_column: null,
};

const obj = {
  tableName: 'People',
  columns: [
    {
      _id: {
        primaryKey: true,
        type: 'SERIAL',
      },
    },
    {
      _id: 'SERIAL',
      primaryKey: true,
    },
    {
      name: 'VARCHAR(255)',
    },
    {
      mass: 'FLOAT',
    },
    {
      hair_color: 'VARCHAR(255)',
    },
    {
      skin_color: 'VARCHAR(255)',
    },
    {
      eye_color: 'VARCHAR(255)',
    },
    {
      birth_year: 'VARCHAR(255)',
    },
    {
      gender: 'VARCHAR(255)',
    },
    {
      height: 'INT',
    },
    {
      Species_id: {
        linkedTable: 'Species._id',
        type: 'INT',
      },
    },
    {
      Species_id: 'INT',
      linkedTable: 'Species._id',
    },
  ],
};
