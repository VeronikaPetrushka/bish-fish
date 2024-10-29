import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Dimensions, Button, ScrollView } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from "react-native-linear-gradient";
import CreateNote from './CreateNote';
import Note from './Note';
import Menu from './Menu';
import Icons from "./Icons"

const { height, width } = Dimensions.get('window');

const Notes = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const [createPressed, setCreatePressed] = useState(false);
    const [notes, setNotes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const translateX = useSharedValue(-width * 0.8);

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

    useFocusEffect(
        useCallback(() => {
            loadNotes();
            if (route.params?.noteCreationTrigger) {
                setCreatePressed(true);
                navigation.setParams({ noteCreationTrigger: false });
            }
        }, [route.params])
    );  

    useEffect(() => {
        if (!createPressed) loadNotes();
    }, [createPressed]);

    const handleCreatePress = () => {
        setCreatePressed(!createPressed);
    };

    const handleCreateNewNote = () => {
        setCreatePressed(true);
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    useEffect(() => {
        translateX.value = withSpring(isMenuOpen ? 0 : -width * 0.75);
    }, [isMenuOpen]);

    const animatedMenuStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
    };

    const filteredNotes = selectedCategory
        ? notes.filter(note => note.category === selectedCategory)
        : notes;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>

                {isMenuOpen && (
                    <Animated.View style={[styles.menuContainer, animatedMenuStyle]}>
                        <Menu onClose={toggleMenu} onCreateNewNote={handleCreateNewNote} setCreatePressed={setCreatePressed}/>
                    </Animated.View>
                )}

            <View style={styles.upperContainer}>
                <TouchableOpacity style={styles.toolIcon} onPress={toggleMenu}>
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
                         <View style={styles.noteBtnContainer}>
            <TouchableOpacity
                style={[
                    styles.noteBtn,
                    selectedCategory === 'Work' && { backgroundColor: 'rgba(255, 0, 0, 0.3)' , borderColor: '#e54d4d'}
                ]}
                onPress={() => handleCategoryPress('Work')}
            >
                <Text style={[styles.noteBtnText, selectedCategory === 'Work' && {color: '#e54d4d'}]}>Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.noteBtn,
                    selectedCategory === 'Study' && { backgroundColor: 'rgba(255, 255, 0, 0.6)', borderColor: '#b48100'}
                ]}
                onPress={() => handleCategoryPress('Study')}
            >
                <Text style={[styles.noteBtnText, selectedCategory === 'Study' && { color: '#b48100' }]}>Study</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.noteBtn,
                    selectedCategory === 'Other' && { backgroundColor: 'rgba(205, 255, 188, 1)', borderColor: '#207c00' }
                ]}
                onPress={() => handleCategoryPress('Other')}
            >
                <Text style={[styles.noteBtnText, selectedCategory === 'Other' && { color: '#207c00'}]}>Other</Text>
            </TouchableOpacity>
        </View>
                        <ScrollView style={{width: '100%', height: height * 0.65}}>
                        {filteredNotes.length > 0 ? (
                                        <Note notes={filteredNotes} loadNotes={loadNotes}/>
                                    ) : (
                                        <Text style={styles.noNotesText}>No created notes for selected category.</Text>
                                    )}
                        <TouchableOpacity style={styles.createBtn} onPress={handleCreatePress}>
                            <Text style={styles.createBtnText}>Create A Note</Text>
                        </TouchableOpacity>
                        </ScrollView>
                    </View>
                )
                )
            }

        </View>
        </GestureHandlerRootView>
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
    menuContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        zIndex: 10,
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
        marginBottom: height * 0.02
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
        marginBottom: height * 0.05,
        marginTop: height * 0.05
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
    noteBtnContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: height * 0.02
    },
    noteBtn: {
        width: '31%',
        padding: 12,
        color: '#000',
        borderColor: '#d3d3d3',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noteBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        fontFamily: 'Nunito',
    },
})

export default Notes;