import { dataSources } from '../data/mockData';
import { Stylesheet } from 'cytoscape';

const baseNodeStyle = {
  'label': 'data(label)',
  'color': '#1F2937',
  'font-size': '10px',
  'text-valign': 'bottom',
  'text-halign': 'center',
  'text-margin-y': '5px',
  'width': '25px',
  'height': '25px'
};

export const graphStyles: Stylesheet[] = [
  {
    selector: 'node',
    style: {
      'background-color': '#3B82F6',
      ...baseNodeStyle
    }
  },
  // Generate source-specific styles dynamically
  ...dataSources.map(source => ({
    selector: `node[source = "${source.id}"]`,
    style: {
      'background-color': source.color
    }
  })),
  {
    selector: 'edge',
    style: {
      'width': 1,
      'line-color': '#94A3B8',
      'target-arrow-color': '#94A3B8',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier'
    }
  },
  {
    selector: ':selected',
    style: {
      'background-color': '#2563EB',
      'line-color': '#2563EB',
      'target-arrow-color': '#2563EB',
      'border-width': '2px',
      'border-color': '#1D4ED8'
    }
  },
  {
    selector: '.highlighted',
    style: {
      'background-color': '#2563EB',
      'line-color': '#2563EB',
      'target-arrow-color': '#2563EB',
      'transition-property': 'background-color, line-color, target-arrow-color',
      'transition-duration': '0.2s'
    }
  },
  {
    selector: '.faded',
    style: {
      'opacity': 0.25,
      'transition-property': 'opacity',
      'transition-duration': '0.2s'
    }
  }
]; 