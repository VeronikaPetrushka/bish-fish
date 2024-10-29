import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, TextInput, Modal } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Icons from "./Icons";

const { height } = Dimensions.get('window');

const AddNote = ({title: initialTitle, note: initialNote, imageUri }) => {
    const navigation = useNavigation();
    const [title, setTitle] = useState(initialTitle);
    const [note, setNote] = useState(initialNote);
    const [modalVisible, setModalVisible] = useState(false);

    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;

    const handleSaveAndExit = async () => {
        try {
            const existingNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
            const updatedNotes = existingNotes.map(n => n.title === initialTitle ? { title, note, imageUri, date: formattedDate } : n);
            await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
            navigation.goBack();
        } catch (error) {
            console.error('Failed to save note:', error);
        }
    };

    const handleDeleteNote = async () => {
        try {
            const existingNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
            const updatedNotes = existingNotes.filter(n => n.title !== initialTitle);
            await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
            navigation.goBack();
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <TouchableOpacity style={styles.toolIcon} onPress={() => navigation.goBack('')}>
                    <Icons type={'arrow'}/>
                </TouchableOpacity>
                <Text style={styles.title}>Edit Note</Text>
                <TouchableOpacity style={styles.toolIcon} onPress={() => setModalVisible(true)}> 
                    <Icons type={'dots'}/>
                </TouchableOpacity>
            </View>
            <TextInput 
                    style={styles.titleInput}
                    placeholder= 'Title'
                    value={title}
                    placeholderTextColor="#7d7d7d"
                    onChangeText={setTitle}
                />
            <TextInput
                    style={styles.noteInput}
                    placeholder= 'Note'
                    value={note}
                    placeholderTextColor="#5955500"
                    onChangeText={setNote}
                    multiline={true}
                    scrollEnabled={true}
                />


            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={handleSaveAndExit}>
                            <Text style={styles.modalSaveButton}>Save & Exit</Text>
                        </TouchableOpacity>
                        <View style={{width: '100%', backgroundColor: '#ddd', height: 0.5}}/>
                        <TouchableOpacity onPress={handleDeleteNote}>
                            <Text style={styles.modalDeleteButton}>Delete this note</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 24,
        paddingTop: height * 0.08,
        backgroundColor: '#e8f7ff'
    },
    upperContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
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
    titleInput: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 26,
        color: '#000',
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',
    },
    noteInput: {
        fontSize: 18,
        fontWeight: '700',
        color: '#595550',
        lineHeight: 23.4,
        fontFamily: 'Nunito',
        textAlign: 'left',
        width: '100%',
        height: height * 0.75,
        textAlignVertical: 'top',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingRight: 24,
        paddingTop: height * 0.12
    },
    modalContent: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalSaveButton: {
        fontSize: 17,
        color: '#000',
        paddingVertical: 11,
        paddingHorizontal: 16
    },
    modalDeleteButton: {
        fontSize: 17,
        color: 'red',
        paddingVertical: 11,
        paddingHorizontal: 16
    },
});

export default AddNote;