var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var Table = require('../src/models/Table');
var ValueField = require('../src/models/ValueField');
var logger = require('../src/utils/logger').logger;
dotenv.config();
var MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}
function migrateFields() {
    return __awaiter(this, void 0, void 0, function () {
        var db, fields, tables, tablesByName, migratedCount, skippedCount, errorCount, _i, fields_1, field, table, error_1, sampleField, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 12, , 13]);
                    // Connect to MongoDB
                    return [4 /*yield*/, mongoose.connect(MONGODB_URI)];
                case 1:
                    // Connect to MongoDB
                    _a.sent();
                    logger.info('Connected to MongoDB');
                    db = mongoose.connection.db;
                    if (!db) {
                        throw new Error('Database connection not established');
                    }
                    return [4 /*yield*/, db.collection('fields').find().toArray()];
                case 2:
                    fields = _a.sent();
                    logger.info("Found " + fields.length + " fields to migrate");
                    return [4 /*yield*/, Table.find().lean()];
                case 3:
                    tables = _a.sent();
                    tablesByName = new Map(tables.map(function (table) { return [table.name, table]; }));
                    logger.info("Found " + tables.length + " tables for reference");
                    migratedCount = 0;
                    skippedCount = 0;
                    errorCount = 0;
                    _i = 0, fields_1 = fields;
                    _a.label = 4;
                case 4:
                    if (!(_i < fields_1.length)) return [3 /*break*/, 9];
                    field = fields_1[_i];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    table = tablesByName.get(field.tableName);
                    if (!table) {
                        logger.warn("Table \"" + field.tableName + "\" not found for field \"" + field.name + "\"");
                        skippedCount++;
                        return [3 /*break*/, 8];
                    }
                    // Create or update the field with proper reference
                    return [4 /*yield*/, ValueField.findOneAndUpdate({ _id: field._id }, {
                            name: field.name,
                            tableId: table._id,
                            type: field.type,
                            alternativeNames: field.alternativeNames || [],
                            description: field.description || '',
                            kgStatus: field.inKnowledgeGraph ? 'Added to KG' : 'Not Added',
                            createdAt: field.createdAt,
                            updatedAt: field.updatedAt
                        }, { upsert: true, "new": true })];
                case 6:
                    // Create or update the field with proper reference
                    _a.sent();
                    migratedCount++;
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    logger.error("Error migrating field \"" + field.name + "\":", error_1);
                    errorCount++;
                    return [3 /*break*/, 8];
                case 8:
                    _i++;
                    return [3 /*break*/, 4];
                case 9:
                    logger.info('Field migration complete:', {
                        total: fields.length,
                        migrated: migratedCount,
                        skipped: skippedCount,
                        errors: errorCount
                    });
                    return [4 /*yield*/, ValueField.findOne().populate('tableId')];
                case 10:
                    sampleField = _a.sent();
                    logger.info('Sample field after migration:', {
                        name: sampleField === null || sampleField === void 0 ? void 0 : sampleField.name,
                        table: (sampleField === null || sampleField === void 0 ? void 0 : sampleField.tableId) ? {
                            id: sampleField.tableId._id,
                            name: sampleField.tableId.name
                        } : null
                    });
                    // Close connection
                    return [4 /*yield*/, mongoose.connection.close()];
                case 11:
                    // Close connection
                    _a.sent();
                    logger.info('Database connection closed');
                    return [3 /*break*/, 13];
                case 12:
                    error_2 = _a.sent();
                    logger.error('Error during field migration:', error_2);
                    process.exit(1);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
migrateFields();
