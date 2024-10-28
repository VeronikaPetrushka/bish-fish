import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, TextInput, ScrollView, Button, StyleSheet, Dimensions } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from "react-native-linear-gradient";
import Icons from "./Icons"

const { height } = Dimensions.get('window');

const Notes = () => {
    const [createPressed, setCreatePressed] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [title, setTitle] = useState('');
    const [warnings, setWarnings] = useState({ title: '', category: '' });
    const [inputHeight, setInputHeight] = useState(50);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const loadNotes = async () => {
            try {
                const storedNotes = await AsyncStorage.getItem('notes');
                if (storedNotes) {
                    setNotes(JSON.parse(storedNotes));
                }
            } catch (error) {
                console.error('Failed to load notes:', error);
            }
        };

        loadNotes();
    }, []);

    const handleCreatePress = () => {
        setCreatePressed(!createPressed);
    };

    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
    };

    const handleImageUpload = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    const handleSubmit = async () => {
        let titleWarning = '';
        let categoryWarning = '';

        if (title.trim().length < 1) {
            titleWarning = 'Note must contain at least 1 character';
        }

        if (!selectedCategory) {
            categoryWarning = 'Please select a category';
        }

        if (titleWarning || categoryWarning) {
            setWarnings({ title: titleWarning, category: categoryWarning });
        } else {
            setWarnings({ title: '', category: '' });

            const defaultImageUri = require('../assets/decor/3.png');
            
            const newNote = {
                title,
                category: selectedCategory,
                imageUri: imageUri || defaultImageUri
            };

            const updatedNotes = [...notes, newNote];
            setNotes(updatedNotes);

            try {
                await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
            } catch (error) {
                console.error('Failed to save note:', error);
            }

            console.log('Note created:', newNote);

            setTitle('');
            setSelectedCategory(null);
            setImageUri(null);
            setCreatePressed(false);
        }
    };

    // const resetNotes = async () => {
    //     await AsyncStorage.removeItem('notes')
    // }

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

            {/* <Button title='Reset' onPress={resetNotes}/> */}

            {
                notes.length === 0 ? (
                <View style={{width: '100%'}}>
                {
                createPressed ? (
                    <View style={styles.createContainer}>

                        <Text style={styles.createText}>Add the image</Text>

                        <TouchableOpacity style={styles.imageContainer} onPress={handleImageUpload}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
                            ) : (
                                <View style={styles.imageIcon}>
                                    <Icons type={'image'} />
                                </View>
                            )}
                        </TouchableOpacity>

                        <TextInput
                            style={[styles.input, { height: inputHeight }]}
                            placeholder="Title"
                            placeholderTextColor="#7d7d7d"
                            value={title}
                            onChangeText={setTitle}
                            multiline={true}
                            textAlignVertical="top"
                            onContentSizeChange={(event) => setInputHeight(event.nativeEvent.contentSize.height)}
                        />
                        {warnings.title ? <Text style={styles.warningText}>{warnings.title}</Text> : null}

                        <Text style={styles.createText}>Choose the category</Text>
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
                        {warnings.category ? <Text style={styles.warningText}>{warnings.category}</Text> : null}

                        <TouchableOpacity style={styles.createNoteBtn} onPress={handleSubmit}>
                            <Text style={styles.createBtnText}>Create</Text>
                        </TouchableOpacity>
                    </View>
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
                    <View style={{width: '100%'}}>
                        <ScrollView style={{width: '100%'}}>
                        {
                            notes.map((note, index) => (
                                <View key={index} style={styles.noteCard}>
                                    {note.imageUri && (
                                        (typeof note.imageUri === 'string' && 
                                        (note.imageUri.startsWith('http://') || 
                                        note.imageUri.startsWith('https://') || 
                                        note.imageUri.startsWith('file://'))) ? (
                                            <Image source={{ uri: note.imageUri }} style={styles.uploadedImage} />
                                    ) : (
                                            <Image source={note.imageUri} style={styles.uploadedImage} />
                                        )
                                    )}
                                    <View style={styles.cardTextContainer}>
                                        <Text style={styles.cardTitle}>{note.title}</Text>
                                    </View>
                                </View>
                            ))
                        }
                        </ScrollView>
                    </View>
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
    createContainer: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    createText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        fontFamily: 'Nunito',
        paddingBottom: height * 0.015,
        lineHeight: 18.2
    },
    imageContainer: {
        width: '100%',
        height: height * 0.2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#d3d3d3',
        borderRadius: 12,
        marginBottom: height * 0.02,
        overflow: 'hidden'
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    imageIcon: {
        width: 80,
        height: 80,
    },
    input: {
        width: '100%',
        borderColor: '#d3d3d3',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 23,
        paddingVertical: 12,
        color: '#000',
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Nunito',
        marginBottom: height * 0.02
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
    createNoteBtn: {
        width: '100%',
        backgroundColor: '#4ca6d9',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14
    },
    warningText: {
        color: 'red',
        fontSize: 12,
        fontWeight: '300',
        marginTop: -10,
        marginBottom: 15
    },
    noteCard: {
        width: '100%',
        height: 354,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    uploadedImage: {
        width: '100%',
        height: 186
    },
    cardTextContainer: {
        padding: 15,
        alignItems: 'flex-start'
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 10
    }
})

export default Notes;