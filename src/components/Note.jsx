import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native"
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const Note = ({ notes }) => {
    const navigation = useNavigation();

    return (
        <View style={{width: '100%'}}>
        {
            notes.map((note, index) => (
                <View key={index} style={styles.noteCard}>
                    <View style={{position: 'absolute', top: 18, right: 0, flexDirection: 'row', zIndex: 10}}>
                        <TouchableOpacity style={styles.toolIcon}>
                            <Icons type={'archive'}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toolIcon}>
                            <Icons type={'delete'}/>
                        </TouchableOpacity>
                    </View>
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
                        <Text style={styles.cardNote} numberOfLines={2} ellipsizeMode="tail">{note.note || ''}</Text>
                        <View style={{width: '100%', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row'}}>
                            <TouchableOpacity 
                                style={styles.openNoteBtn} 
                                onPress={() => navigation.navigate('AddNoteScreen', {
                                    title: note.title, 
                                    note: note.note,
                                    imageUri: note.imageUri
                            })}>
                                <Text style={styles.openNoteBtnText}>Open</Text>
                            </TouchableOpacity>
                            <Text style={styles.cardDate}>{note.date}</Text>
                        </View>
                    </View>
                </View>
            ))
        }
    </View>
    )
};

const styles = StyleSheet.create({
    noteCard: {
        width: '100%',
        height: 365,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    toolIcon: {
        width: 42,
        height: 42,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        marginRight: 14
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
    },
    cardNote: {
        fontSize: 18,
        fontWeight: '700',
        color: '#595550',
        lineHeight: 23.4,
        fontFamily: 'Nunito',
        height: 47,
        marginBottom: 17,
        overflow: 'hidden',
    },
    openNoteBtn: {
        width: 122,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: '#4ca6d9',
        marginRight: 26
    },
    openNoteBtnText: {
        color: '#fff',
        lineHeight: 23.4,
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'Nunito'
    },
    cardDate: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
        fontFamily: 'Nunito'
    }
})

export default Note;