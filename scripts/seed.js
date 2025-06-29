"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI not found in environment variables');
    process.exit(1);
}
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var client, db, sources, sourcesResult, tables, tablesResult, relationships, relationshipsResult, inverseRelationships, inverseResult, indirectRelationships, indirectResult, selfRelationships, selfResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting database seeding...');
                    client = new mongodb_1.MongoClient(uri);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 14, 15, 17]);
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _a.sent();
                    console.log('Connected to MongoDB');
                    db = client.db('knowledge-graph');
                    // Clear existing data
                    return [4 /*yield*/, db.collection('sources').deleteMany({})];
                case 3:
                    // Clear existing data
                    _a.sent();
                    return [4 /*yield*/, db.collection('tables').deleteMany({})];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.collection('relationships').deleteMany({})];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db.collection('audit_logs').deleteMany({})];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db.collection('sync_jobs').deleteMany({})];
                case 7:
                    _a.sent();
                    sources = [
                        {
                            name: 'Intelex Suite EHS',
                            type: 'EHS System',
                            description: 'Environmental Health and Safety Management System',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            name: 'Azure IoT Suite',
                            type: 'IoT Platform',
                            description: 'IoT Device Management and Telemetry Platform',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            name: 'SAP HANA ERP',
                            type: 'ERP System',
                            description: 'Enterprise Resource Planning System',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ];
                    return [4 /*yield*/, db.collection('sources').insertMany(sources)];
                case 8:
                    sourcesResult = _a.sent();
                    console.log('Inserted sources:', sourcesResult.insertedCount);
                    tables = [
                        {
                            name: 'AUDITS',
                            alternativeNames: ['Safety Audits', 'Compliance Checks'],
                            sourceId: sourcesResult.insertedIds[0],
                            description: 'Safety and compliance audit data',
                            fields: [],
                            fieldsCount: 45,
                            recordsCount: 10000,
                            kgRecordsCount: 9500,
                            kgStatus: 'Partially Added',
                            hasMetadata: true,
                            lastSync: new Date(),
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            name: 'DEVICES',
                            alternativeNames: ['IoT Devices', 'Connected Assets'],
                            sourceId: sourcesResult.insertedIds[1],
                            description: 'IoT device registry and configuration',
                            fields: [],
                            fieldsCount: 35,
                            recordsCount: 50000,
                            kgRecordsCount: 50000,
                            kgStatus: 'Added to KG',
                            hasMetadata: true,
                            lastSync: new Date(),
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            name: 'EquipmentMaster',
                            alternativeNames: ['AssetRegistry', 'PlantEquipment'],
                            sourceId: sourcesResult.insertedIds[2],
                            description: 'Master record of all plant equipment and technical assets',
                            fields: [],
                            fieldsCount: 45,
                            recordsCount: 20000,
                            kgRecordsCount: 20000,
                            kgStatus: 'Added to KG',
                            hasMetadata: true,
                            lastSync: new Date(),
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            name: 'FunctionalLocationMaster',
                            alternativeNames: ['PlantLocations', 'EquipmentSites'],
                            sourceId: sourcesResult.insertedIds[2],
                            description: 'Hierarchical structure of plant functional locations',
                            fields: [],
                            fieldsCount: 35,
                            recordsCount: 8000,
                            kgRecordsCount: 8000,
                            kgStatus: 'Added to KG',
                            hasMetadata: true,
                            lastSync: new Date(),
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            name: 'INCIDENTS',
                            alternativeNames: ['Safety Incidents', 'EHS Events'],
                            sourceId: sourcesResult.insertedIds[0],
                            description: 'Safety and environmental incident records',
                            fields: [],
                            fieldsCount: 50,
                            recordsCount: 25000,
                            kgRecordsCount: 25000,
                            kgStatus: 'Added to KG',
                            hasMetadata: true,
                            lastSync: new Date(),
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ];
                    return [4 /*yield*/, db.collection('tables').insertMany(tables)];
                case 9:
                    tablesResult = _a.sent();
                    console.log('Inserted tables:', tablesResult.insertedCount);
                    relationships = [
                        {
                            name: 'ASSET_AT_LOCATION',
                            type: 'direct',
                            fromTable: 'AssetRegistry',
                            fromField: 'LOCATION_ID',
                            toTable: 'LocationHierarchy',
                            toField: 'LOCATION_ID',
                            description: 'Links each asset to its physical location',
                            alternativeNames: ['ASSET_AT_LOCATION'],
                            inKnowledgeGraph: true,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            name: 'PARENT_OF',
                            type: 'direct',
                            fromTable: 'LocationHierarchy',
                            fromField: 'PARENT_LOCATION_ID',
                            toTable: 'LocationHierarchy',
                            toField: 'LOCATION_ID',
                            description: 'Hierarchical parent-child link between locations',
                            alternativeNames: ['PARENT_OF'],
                            inKnowledgeGraph: true,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            name: 'EQUIPMENT_IS_ASSET',
                            type: 'direct',
                            fromTable: 'EquipmentMaster',
                            fromField: 'EQUIPMENT_ID',
                            toTable: 'AssetRegistry',
                            toField: 'ASSET_ID',
                            description: 'Relates equipment record back to the asset registry',
                            alternativeNames: ['EQUIPMENT_IS_ASSET'],
                            inKnowledgeGraph: true,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ];
                    return [4 /*yield*/, db.collection('relationships').insertMany(relationships)];
                case 10:
                    relationshipsResult = _a.sent();
                    console.log('Inserted relationships:', relationshipsResult.insertedCount);
                    inverseRelationships = [
                        {
                            name: 'located_at',
                            type: 'inverse',
                            fromTable: 'ASSET_MASTER',
                            fromField: 'LOCATION_ID',
                            toTable: 'LOCATIONS',
                            toField: 'ID',
                            inverseNames: ['located_at', 'has_location'],
                            description: 'Inverse relationship for asset location',
                            inKnowledgeGraph: true,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            name: 'is_parent_of',
                            type: 'inverse',
                            fromTable: 'EQUIPMENT',
                            fromField: 'PARENT_ID',
                            toTable: 'EQUIPMENT',
                            toField: 'ID',
                            inverseNames: ['is_parent_of', 'contains'],
                            description: 'Inverse relationship for equipment hierarchy',
                            inKnowledgeGraph: false,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ];
                    return [4 /*yield*/, db.collection('relationships').insertMany(inverseRelationships)];
                case 11:
                    inverseResult = _a.sent();
                    console.log('Inserted inverse relationships:', inverseResult.insertedCount);
                    indirectRelationships = [
                        {
                            name: 'HAS_WORK_ORDER_AT_LOCATION',
                            type: 'indirect',
                            tablePath: ['ASSET_MASTER', 'LOCATIONS', 'WORK_ORDERS'],
                            description: 'Work orders at the same location as the asset',
                            alternativeNames: ['Located Work Orders', 'Site Maintenance'],
                            inKnowledgeGraph: true,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            name: 'EQUIPMENT_WORK_ORDERS',
                            type: 'indirect',
                            tablePath: ['EQUIPMENT', 'ASSET_MASTER', 'WORK_ORDERS'],
                            description: 'Work orders related to equipment through asset master',
                            alternativeNames: ['Equipment Maintenance', 'Related Work'],
                            inKnowledgeGraph: false,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ];
                    return [4 /*yield*/, db.collection('relationships').insertMany(indirectRelationships)];
                case 12:
                    indirectResult = _a.sent();
                    console.log('Inserted indirect relationships:', indirectResult.insertedCount);
                    selfRelationships = [
                        {
                            name: 'LOCATED_AT_SAME_SITE',
                            type: 'self',
                            primaryTable: 'ASSET_MASTER',
                            referenceTable: 'LOCATIONS',
                            description: 'Assets that share the same physical location',
                            alternativeNames: ['Co-located Assets', 'Same Location Assets'],
                            inKnowledgeGraph: true,
                            createdAt: new Date('2025-02-15'),
                            updatedAt: new Date()
                        },
                        {
                            name: 'MAINTAINED_TOGETHER',
                            type: 'self',
                            primaryTable: 'EQUIPMENT',
                            referenceTable: 'WORK_ORDERS',
                            description: 'Equipment that are maintained under the same work orders',
                            alternativeNames: ['Joint Maintenance', 'Shared Work Orders'],
                            inKnowledgeGraph: true,
                            createdAt: new Date('2025-02-15'),
                            updatedAt: new Date()
                        }
                    ];
                    return [4 /*yield*/, db.collection('relationships').insertMany(selfRelationships)];
                case 13:
                    selfResult = _a.sent();
                    console.log('Inserted self relationships:', selfResult.insertedCount);
                    console.log('Database seeding completed successfully');
                    return [3 /*break*/, 17];
                case 14:
                    error_1 = _a.sent();
                    console.error('Error seeding database:', error_1);
                    return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, client.close()];
                case 16:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    });
}
seed().catch(console.error);
