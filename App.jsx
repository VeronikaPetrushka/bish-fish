import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import NotesScreen from './src/screens/NotesScreen';
import AddNoteScreen from './src/screens/AddNoteScreen';
import DeletedScreen from './src/screens/DeletedScreen';
import ArchivedScreen from './src/screens/ArchivedScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import { NotesProvider } from './src/constants/context';

enableScreens();

const Stack = createStackNavigator();

const App = () => {
  
    return (
        <NotesProvider>
            <NavigationContainer>
                    <Stack.Navigator initialRouteName="HomeScreen">
                        <Stack.Screen 
                            name="HomeScreen" 
                            component={HomeScreen} 
                            options={{ headerShown: false }} 
                        />
                        <Stack.Screen 
                            name="NotesScreen" 
                            component={NotesScreen} 
                            options={{ headerShown: false }} 
                        />
                        <Stack.Screen 
                            name="AddNoteScreen" 
                            component={AddNoteScreen} 
                            options={{ headerShown: false }} 
                        />
                        <Stack.Screen 
                            name="DeletedScreen" 
                            component={DeletedScreen} 
                            options={{ headerShown: false }} 
                        />
                        <Stack.Screen 
                            name="ArchivedScreen" 
                            component={ArchivedScreen} 
                            options={{ headerShown: false }} 
                        />
                        <Stack.Screen 
                            name="CalendarScreen" 
                            component={CalendarScreen} 
                            options={{ headerShown: false }} 
                        />
                    </Stack.Navigator>
            </NavigationContainer>
        </NotesProvider>
    );
};

export default App;
