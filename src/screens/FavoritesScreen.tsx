import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, ToastAndroid, SafeAreaView } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ArtItem } from '../types/types';
import { Ionicons } from '@expo/vector-icons';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;
type FavoritesScreenRouteProp = RouteProp<RootStackParamList, 'Favorites'>;

const FavoritesScreen = () => {
    const { favorites, removeFavorite, removeMultipleFavorites } = useFavorites();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const navigation = useNavigation<FavoritesScreenNavigationProp>();
    const route = useRoute<FavoritesScreenRouteProp>();

    const { fromDetail, detailItem } = route.params ?? {};

    const handleBackToDetail = useCallback(() => {
        if (fromDetail && detailItem) {
            navigation.navigate('Detail', { item: detailItem });
        }
    }, [fromDetail, detailItem, navigation]);

    const toggleSelectAll = useCallback(() => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(favorites.map(item => item.id));
        }
        setSelectAll(!selectAll);
    }, [selectAll, favorites]);

    const toggleSelectItem = useCallback((id: number) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    }, []);

    const deleteSelectedItems = useCallback(() => {
        removeMultipleFavorites(selectedItems);
        setSelectedItems([]);
        setSelectAll(false);
        ToastAndroid.show("Selected items removed!", ToastAndroid.SHORT);
    }, [removeMultipleFavorites, selectedItems]);

    const renderFavorite = useCallback(({ item }: { item: ArtItem }) => (
        <Pressable
            style={styles.favoriteCard}
            onPress={() => navigation.navigate('Detail', { item })}
        >
            <Pressable
                onPress={() => toggleSelectItem(item.id)}
                style={styles.checkbox}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons
                    name={selectedItems.includes(item.id) ? "checkbox" : "checkbox-outline"}
                    size={24}
                    color="#4a4a4a"
                />
            </Pressable>
            <Image source={{ uri: item.image }} style={styles.favoriteImage} />
            <View style={styles.favoriteInfo}>
                <Text style={styles.artName} numberOfLines={1}>{item.artName}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <Pressable
                    onPress={() => removeFavorite(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="trash-outline" size={24} color="#ff6b6b" />
                </Pressable>
            </View>
        </Pressable>
    ), [selectedItems, toggleSelectItem, removeFavorite, navigation]);

    return (
        <SafeAreaView style={styles.container}>
            {fromDetail && (
                <Pressable style={styles.backButton} onPress={handleBackToDetail}>
                    <Ionicons name="arrow-back" size={24} color="#4a4a4a" />
                    <Text style={styles.backButtonText}>Back to Detail</Text>
                </Pressable>
            )}
            <Text style={styles.title}>My Favorites</Text>
            {favorites.length > 0 ? (
                <>
                    <View style={styles.actionBar}>
                        {favorites.length > 1 && (
                            <Pressable onPress={toggleSelectAll} style={styles.selectAllButton}>
                                <Ionicons
                                    name={selectAll ? "checkbox" : "checkbox-outline"}
                                    size={24}
                                    color="#4a4a4a"
                                />
                                <Text style={styles.selectAllText}>Select All</Text>
                            </Pressable>
                        )}
                        {selectedItems.length > 0 && (
                            <Pressable style={styles.deleteButton} onPress={deleteSelectedItems}>
                                <Ionicons name="trash-outline" size={20} color="white" />
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </Pressable>
                        )}
                    </View>
                    <FlatList
                        data={favorites}
                        renderItem={renderFavorite}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>No favorites added yet!</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    backButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#4a4a4a',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    selectAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectAllText: {
        fontSize: 16,
        marginLeft: 5,
        color: '#4a4a4a',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff6b6b',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 5,
    },
    listContainer: {
        paddingHorizontal: 15,
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
    checkbox: {
        marginRight: 10,
    },
    favoriteImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    favoriteInfo: {
        flex: 1,
        marginLeft: 15,
    },
    artName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    price: {
        fontSize: 16,
        color: '#4caf50',
        marginBottom: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 20,
        fontSize: 18,
        color: '#999',
    },
});

export default FavoritesScreen;