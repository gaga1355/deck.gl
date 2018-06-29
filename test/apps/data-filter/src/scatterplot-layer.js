import {ScatterplotLayer} from '@deck.gl/layers';
import dataFilter from './data-filter';

const defaultProps = {
  getFilterValue: 1
};

export default class MyScatterplotLayer extends ScatterplotLayer {

  getShaders() {
    const shaderSettings = super.getShaders();

    shaderSettings.modules.push(dataFilter);

    shaderSettings.inject = {
      'vs:#decl': `
attribute float instanceFilterValue;
`,
      'vs:#main-end': `
filter_setVisibility(instanceFilterValue);
`,
      'fs:#main-end': `
gl_FragColor = filter_filterColor(gl_FragColor);
`
    };
    return shaderSettings;
  }

  initializeState() {
    super.initializeState();

    this.getAttributeManager().addInstanced({
      instanceFilterValue: {size: 1, accessor: 'getFilterValue'}
    });
  }
}

MyScatterplotLayer.defaultProps = defaultProps;
