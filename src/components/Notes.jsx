import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Dimensions, Button, ScrollView } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from "react-native-linear-gradient";
import CreateNote from './CreateNote';
import Note from './Note';
import Icons from "./Icons"

const { height } = Dimensions.get('window');

const Notes = () => {
    const [createPressed, setCreatePressed] = useState(false);
    const [notes, setNotes] = useState([]);

    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            if (storedNotes) setNotes(JSON.parse(storedNotes));
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    };

    useEffect(() => {
        loadNotes();
    }, []);

    useEffect(() => {
        if (!createPressed) loadNotes();
    }, [createPressed]);

    const handleCreatePress = () => {
        setCreatePressed(!createPressed);
    };

    const resetNotes = async () => {
        await AsyncStorage.removeItem('notes')
    }

    return (
        <View style={styles.container}>

            <View style={styles.upperContainer}>
                <TouchableOpacity style={styles.toolIcon}>
                    <Icons type={'menu'}/>
                </TouchableOpacity>
                <Text style={styles.title}>All Notes</Text>
                <TouchableOpacity style={styles.toolIcon}> 
                    <Icons type={'search'}/>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.inspoBtn}>
                <LinearGradient
                colors={['#4CA6D9', '#D478FF']}
                start={{ x: -0.15, y: 0.5 }}
                end={{ x: 1.1, y: 0.5 }}
                style={[styles.gradient]}
            >
                <View style={styles.sparkleIcon}>
                    <Icons type={'sparkle'}/>
                </View>
                <Text style={styles.inspoBtnText}>Daily inspiration</Text>
                </LinearGradient>
            </TouchableOpacity>

            <Button title='Reset' onPress={resetNotes}/>

            {
                notes.length === 0 ? (
                <View style={{width: '100%'}}>
                {
                createPressed ? (
                    <CreateNote setCreatePressed={setCreatePressed}/>
                ) : (
                    <View style={{width: '100%'}}>
            <View style={{width: '100%', paddingHorizontal: 13, alignItems: 'center'}}>
                <Image source={require('../assets/decor/1.png')} style={styles.image}/>
            <Text style={styles.noNotesTitle}>Create Your First Note</Text>
            <Text style={styles.noNotesText}>Add a note about anything (your thoughts on climate change, or your history essay) and share it with the world.</Text>
            <TouchableOpacity style={styles.createBtn} onPress={handleCreatePress}>
                <Text style={styles.createBtnText}>Create A Note</Text>
            </TouchableOpacity>
            </View>
                    </View>
                )
            }
            </View>
            ) : (
                createPressed ? (
                    <CreateNote setCreatePressed={setCreatePressed} />   
                ) : (
                    <View style={{width: '100%'}}>
                        <ScrollView style={{width: '100%', height: height * 0.65}}>
                        <Note notes={notes} />
                        <TouchableOpacity style={styles.createBtn} onPress={handleCreatePress}>
                            <Text style={styles.createBtnText}>Create A Note</Text>
                        </TouchableOpacity>
                        </ScrollView>
                    </View>
                )
                )
            }

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 15,
        paddingTop: height * 0.08,
        backgroundColor: '#e8f7ff'
    },
    upperContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: height * 0.05
    },
    toolIcon: {
        width: 24,
        height: 24,
    },
    title: {
        fontWeight: '900',
        fontSize: 16,
        color: '#403b36',
        fontFamily: 'Nunito'
    },
    inspoBtn: {
        width: '100%',
        height: height * 0.065,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: height * 0.05
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        flexDirection: 'row',
    },
    sparkleIcon: {
        width: 22,
        height: 22,
        marginRight: 13
    },
    inspoBtnText: {
        fontSize: 17,
        color: '#fff',
        fontFamily: 'Nunito',
        fontWeight: '900'
    },
    image: {
        width: height * 0.32,
        height: height * 0.32,
        resizeMode: 'contain',
        marginBottom: height * 0.05
    },
    noNotesTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#403b36',
        fontFamily: 'Nunito',
        paddingBottom: height * 0.015
    },
    noNotesText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#595550',
        fontFamily: 'Nunito',
        paddingBottom: height * 0.06,
        textAlign: 'center',
        lineHeight: 21.82
    },
    createBtn: {
        width: '100%',
        backgroundColor: '#4ca6d9',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
    },
    createBtnText: {
        fontWeight: '900',
        fontFamily: 'Nunito',
        fontSize: 20,
        color: '#fffdfa',
    },
})

export default Notes;