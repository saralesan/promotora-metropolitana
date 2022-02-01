/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
import ContentList from '../../components/ContentList';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  return (
    <ContentList></ContentList>
  );
};

export default memo(HomePage);
