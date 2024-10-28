import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icons = ({ type }) => {

  let imageSource;
  let iconStyle = [styles.icon];

  switch (type) {
    case 'menu':
        imageSource = require('../assets/notes/menu.png');
        break;
    case 'search':
        imageSource = require('../assets/notes/search.png');
        break;
    case 'sparkle':
        imageSource = require('../assets/notes/sparkle.png');
        break;
    case 'edit':
        imageSource = require('../assets/notes/edit.png');
        break;
    case 'delete':
        imageSource = require('../assets/notes/delete.png');
        break;
    case 'image':
        imageSource = require('../assets/notes/image.png');
        iconStyle.push(styles.image);
        break;

    // case 'statistics':
    //     imageSource = require('../assets/panel/calendar.png');
    //     iconStyle.push(styles.panel);
    //     break;
  }

  return (
    <Image 
      source={imageSource} 
      style={iconStyle} 
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }
});

export default Icons;
