import React, { useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, ToastAndroid } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = () => {
    const { favorites, removeFavorite, removeMultipleFavorites } = useFavorites();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]); // Deselect all
        } else {
            const allItemIds = favorites.map(item => item.id);
            setSelectedItems(allItemIds); // Select all
        }
        setSelectAll(!selectAll); // Toggle select all
    };

    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id)); // Deselect item
        } else {
            setSelectedItems([...selectedItems, id]); // Select item
        }
    };

    const deleteSelectedItems = () => {
        removeMultipleFavorites(selectedItems);
        setSelectedItems([]);
        setSelectAll(false);
        ToastAndroid.show("Selected items removed!", ToastAndroid.SHORT); // Toast notification
    };

    const renderFavorite = ({ item }) => (
        <View style={styles.favoriteCard}>
            <Pressable onPress={() => toggleSelectItem(item.id)} style={styles.checkbox}>
                <Ionicons
                    name={selectedItems.includes(item.id) ? "checkbox" : "checkbox-outline"}
                    size={24}
                    color="black"
                />
            </Pressable>
            <Image source={{ uri: item.image }} style={styles.favoriteImage} />
            <View style={styles.favoriteInfo}>
                <Text style={styles.artName}>{item.artName}</Text>
                <Text style={styles.price}>${item.price}</Text>
                <Pressable onPress={() => removeFavorite(item.id)}>
                    <Ionicons name="trash" size={24} color="red" />
                </Pressable>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorites</Text>
            {favorites.length > 0 ? (
                <>
                    {favorites.length > 1 && (
                        <View style={styles.selectAllContainer}>
                            <Pressable onPress={toggleSelectAll} style={styles.selectAllButton}>
                                <Ionicons
                                    name={selectAll ? "checkbox" : "checkbox-outline"}
                                    size={24}
                                    color="black"
                                />
                                <Text style={styles.selectAllText}> Select All</Text>
                            </Pressable>
                        </View>
                    )}
                    {selectedItems.length > 0 && (
                        <Pressable style={styles.deleteButton} onPress={deleteSelectedItems}>
                            <Text style={styles.deleteButtonText}>Delete Selected</Text>
                        </Pressable>
                    )}
                    <FlatList
                        data={favorites}
                        renderItem={renderFavorite}
                        keyExtractor={item => item.id.toString()}
                    />
                </>
            ) : (
                <Text style={styles.emptyText}>No favorites added yet!</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    favoriteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    favoriteImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    favoriteInfo: {
        flex: 1,
        marginLeft: 10,
    },
    artName: {
        fontSize: 20,
        fontWeight: '600',
    },
    price: {
        fontSize: 16,
        color: '#666',
        marginVertical: 5,
    },
    selectAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    selectAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectAllText: {
        fontSize: 18,
        marginLeft: 5,
    },
    deleteButton: {
        backgroundColor: '#d9534f',
        padding: 12,
        borderRadius: 5,
        marginBottom: 15,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#777',
        marginTop: 50,
    },
    checkbox: {
        marginRight: 10,
    },
});

export default FavoritesScreen;
