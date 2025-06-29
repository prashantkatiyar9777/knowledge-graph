import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, Server, Cloud, Shield, Factory,
  ArrowRight, Check, RefreshCw
} from 'lucide-react';
import { Card, Button } from "../../components/ui";
import { cn } from '../utils/cn';

interface PlatformCardProps {
  name: string;
  icon: string;
  stats: {
    tables: number;
    records: number;
    tablesInKG: number;
    recordsInKG: number;
    contextualization: number;
  };
  type: string;
  href: string;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ name, icon, stats, type, href }) => (
  <Link to={`/platform-tables?source=${encodeURIComponent(name)}`} className="block">
    <Card className="h-full hover:border-primary transition-colors">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl">
              {icon}
            </div>
            <div>
              <h3 className="font-medium text-slate-900">{name}</h3>
              <p className="text-sm text-slate-500">{type}</p>
            </div>
          </div>
          <ArrowRight className="text-slate-400" size={20} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-semibold text-slate-900">{stats.tables}</div>
            <div className="text-sm text-slate-600">Total Tables</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-slate-900">
              {stats.tablesInKG}
              <span className="text-sm text-slate-500 ml-1">
                ({Math.round((stats.tablesInKG / stats.tables) * 100)}%)
              </span>
            </div>
            <div className="text-sm text-slate-600">Tables in KG</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-600">Records</span>
              <span className="font-medium text-slate-700">
                {stats.recordsInKG.toLocaleString()} / {stats.records.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(stats.recordsInKG / stats.records) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-600">Contextualization</span>
              <span className="font-medium text-slate-700">{stats.contextualization}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.contextualization}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  </Link>
);

const DashboardBuilder: React.FC = () => {
  const platforms = {
    cwp: [
      {
        id: 'innovapptive',
        name: 'Innovapptive',
        description: 'Connected Worker Platfrom',
        icon: '📊',
        stats: {
          tables: 14,
          records: 8700000,
          tablesInKG: 110,
          recordsInKG: 4200000,
          contextualization: 98
        }
      }
    ],
    historians: [
      {
        id: 'factry',
        name: 'Factry Historian',
        description: 'Process data historian',
        icon: '📊',
        stats: {
          tables: 12,
          records: 1500000,
          tablesInKG: 10,
          recordsInKG: 1200000,
          contextualization: 85
        }
      },
      {
        id: 'aveva',
        name: 'Aveva Historian',
        description: 'Industrial data management',
        icon: '📈',
        stats: {
          tables: 15,
          records: 2000000,
          tablesInKG: 12,
          recordsInKG: 1800000,
          contextualization: 80
        }
      },
      {
        id: 'aspen',
        name: 'Aspen InfoPlus.21 Historian',
        description: 'Process historian',
        icon: '📉',
        stats: {
          tables: 18,
          records: 1800000,
          tablesInKG: 15,
          recordsInKG: 1500000,
          contextualization: 75
        }
      },
      {
        id: 'ge-historian',
        name: 'GE Proficy Historian',
        description: 'Time-series historian',
        icon: '⏲️',
        stats: {
          tables: 14,
          records: 1600000,
          tablesInKG: 11,
          recordsInKG: 1400000,
          contextualization: 82
        }
      }
    ],
    erp: [
      {
        id: 'oracle-fusion',
        name: 'Oracle Fusion Cloud ERP',
        description: 'Enterprise resource planning',
        icon: '🏢',
        stats: {
          tables: 85,
          records: 500000,
          tablesInKG: 70,
          recordsInKG: 450000,
          contextualization: 88
        }
      },
      {
        id: 'pronto',
        name: 'Pronto Xi ERP',
        description: 'Business management system',
        icon: '💼',
        stats: {
          tables: 65,
          records: 300000,
          tablesInKG: 55,
          recordsInKG: 250000,
          contextualization: 78
        }
      },
      {
        id: 'sap-hana',
        name: 'SAP HANA ERP',
        description: 'Enterprise management',
        icon: '🏭',
        stats: {
          tables: 120,
          records: 800000,
          tablesInKG: 100,
          recordsInKG: 700000,
          contextualization: 92
        }
      },
      {
        id: 'ibm-maximo',
        name: 'IBM Maximo ERP',
        description: 'Asset management',
        icon: '🔧',
        stats: {
          tables: 75,
          records: 400000,
          tablesInKG: 65,
          recordsInKG: 350000,
          contextualization: 85
        }
      }
    ],
    iot: [
      {
        id: 'azure-iot',
        name: 'Azure IoT Suite',
        description: 'IoT platform services',
        icon: '☁️',
        stats: {
          tables: 25,
          records: 2000000,
          tablesInKG: 20,
          recordsInKG: 1800000,
          contextualization: 90
        }
      },
      {
        id: 'siemens-mindsphere',
        name: 'Siemens MindSphere IoT',
        description: 'Industrial IoT',
        icon: '🌐',
        stats: {
          tables: 30,
          records: 2500000,
          tablesInKG: 25,
          recordsInKG: 2200000,
          contextualization: 88
        }
      },
      {
        id: 'ptc-kepware',
        name: 'PTC Kepware IoT',
        description: 'Industrial connectivity',
        icon: '🔌',
        stats: {
          tables: 20,
          records: 1500000,
          tablesInKG: 18,
          recordsInKG: 1350000,
          contextualization: 85
        }
      },
      {
        id: 'ptc-thingworx',
        name: 'PTC ThingWorx IIoT',
        description: 'Industrial IoT platform',
        icon: '📡',
        stats: {
          tables: 28,
          records: 1800000,
          tablesInKG: 24,
          recordsInKG: 1600000,
          contextualization: 82
        }
      },
      {
        id: 'losant',
        name: 'Losant Enterprise IoT',
        description: 'IoT application platform',
        icon: '🛰️',
        stats: {
          tables: 22,
          records: 1600000,
          tablesInKG: 19,
          recordsInKG: 1400000,
          contextualization: 80
        }
      }
    ],
    ehs: [
      {
        id: 'intelex',
        name: 'Intelex Suite EHS',
        description: 'EHS management',
        icon: '🛡️',
        stats: {
          tables: 45,
          records: 200000,
          tablesInKG: 40,
          recordsInKG: 180000,
          contextualization: 92
        }
      },
      {
        id: 'enablon',
        name: 'Wolters Kluwer Enablon EHS',
        description: 'Risk management',
        icon: '⚠️',
        stats: {
          tables: 50,
          records: 250000,
          tablesInKG: 45,
          recordsInKG: 225000,
          contextualization: 90
        }
      },
      {
        id: 'sphera',
        name: 'Sphera Cloud EHS',
        description: 'Safety management',
        icon: '🔒',
        stats: {
          tables: 40,
          records: 180000,
          tablesInKG: 35,
          recordsInKG: 160000,
          contextualization: 88
        }
      }
    ],
    mes: [
      {
        id: 'ge-proficy',
        name: 'GE Proficy Smart Factory MES',
        description: 'Manufacturing execution',
        icon: '🏭',
        stats: {
          tables: 65,
          records: 500000,
          tablesInKG: 55,
          recordsInKG: 450000,
          contextualization: 85
        }
      },
      {
        id: 'dynamics-mes',
        name: 'Microsoft Dynamics 365 MES',
        description: 'Production management',
        icon: '⚙️',
        stats: {
          tables: 70,
          records: 550000,
          tablesInKG: 60,
          recordsInKG: 500000,
          contextualization: 88
        }
      },
      {
        id: 'siemens-opcenter',
        name: 'Siemens Opcenter MES',
        description: 'Manufacturing operations',
        icon: '🏗️',
        stats: {
          tables: 75,
          records: 600000,
          tablesInKG: 65,
          recordsInKG: 550000,
          contextualization: 90
        }
      },
      {
        id: 'rockwell',
        name: 'Rockwell MES Suite',
        description: 'Production control',
        icon: '🔨',
        stats: {
          tables: 60,
          records: 450000,
          tablesInKG: 50,
          recordsInKG: 400000,
          contextualization: 82
        }
      },
      {
        id: 'sap-mes',
        name: 'SAP MES',
        description: 'Manufacturing execution',
        icon: '🏢',
        stats: {
          tables: 80,
          records: 650000,
          tablesInKG: 70,
          recordsInKG: 600000,
          contextualization: 92
        }
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Platforms</h1>
          <p className="mt-1 text-sm text-slate-600">
            Convert your integrated platforms to knowledge graphs
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<RefreshCw size={16} />}
        >
          Update Knowledge Graph
        </Button>
      </div>

      <div className="space-y-6">
        
        {/* Conncected Worker Platforms */}
        <div>
          <h2 className="text-lg font-medium text-slate-900 mb-4">Conncected Worker Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.cwp.map((platform) => (
              <PlatformCard
                key={platform.name}
                name={platform.name}
                icon={platform.icon}
                type={platform.description}
                stats={platform.stats}
                href={`/tables?source=${encodeURIComponent(platform.name)}`}
              />
            ))}
          </div>
        </div>

        
        {/* Historians */}
        <div>
          <h2 className="text-lg font-medium text-slate-900 mb-4">Process Historians</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.historians.map((platform) => (
              <PlatformCard
                key={platform.name}
                name={platform.name}
                icon={platform.icon}
                type={platform.description}
                stats={platform.stats}
                href={`/tables?source=${encodeURIComponent(platform.name)}`}
              />
            ))}
          </div>
        </div>

        {/* ERP Systems */}
        <div>
          <h2 className="text-lg font-medium text-slate-900 mb-4">ERP Systems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.erp.map((platform) => (
              <PlatformCard
                key={platform.name}
                name={platform.name}
                icon={platform.icon}
                type={platform.description}
                stats={platform.stats}
                href={`/tables?source=${encodeURIComponent(platform.name)}`}
              />
            ))}
          </div>
        </div>

        {/* IoT Platforms */}
        <div>
          <h2 className="text-lg font-medium text-slate-900 mb-4">IoT Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.iot.map((platform) => (
              <PlatformCard
                key={platform.name}
                name={platform.name}
                icon={platform.icon}
                type={platform.description}
                stats={platform.stats}
                href={`/tables?source=${encodeURIComponent(platform.name)}`}
              />
            ))}
          </div>
        </div>

        {/* EHS Systems */}
        <div>
          <h2 className="text-lg font-medium text-slate-900 mb-4">EHS Systems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.ehs.map((platform) => (
              <PlatformCard
                key={platform.name}
                name={platform.name}
                icon={platform.icon}
                type={platform.description}
                stats={platform.stats}
                href={`/tables?source=${encodeURIComponent(platform.name)}`}
              />
            ))}
          </div>
        </div>

        {/* MES Systems */}
        <div>
          <h2 className="text-lg font-medium text-slate-900 mb-4">Manufacturing Execution Systems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.mes.map((platform) => (
              <PlatformCard
                key={platform.name}
                name={platform.name}
                icon={platform.icon}
                type={platform.description}
                stats={platform.stats}
                href={`/tables?source=${encodeURIComponent(platform.name)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBuilder;