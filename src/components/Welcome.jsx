import React from "react"
import { View, Image, StyleSheet, Dimensions } from "react-native"

const { height, width } = Dimensions.get('window');

const Welcome = () => {

    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
                <Image style={styles.image} source={require('../assets/decor/1.png')}/>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    imgContainer: {
        width: '100%',
        height: width * 1.07,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: height * 0.034
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
})

export default Welcome;