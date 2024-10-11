import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import FavoriteButton from './FavoriteButton';

interface ArtToolCardProps {
    item: {
        id: string;
        artName: string;
        price: number;
        image: string;
        limitedTimeDeal: number;
    };
    isFavorite: boolean;
    onPress: () => void;
    toggleFavorite: (item: ArtToolCardProps['item']) => void;
}

const ArtToolCard: React.FC<ArtToolCardProps> = ({ item, isFavorite, onPress, toggleFavorite }) => {
    const discountedPrice = item.limitedTimeDeal > 0 ? item.price * (1 - item.limitedTimeDeal) : item.price;

    return (
        <Pressable onPress={onPress} style={styles.cardContainer}>
            <Image source={{ uri: item.image }} style={styles.artToolImage} />
            <View style={styles.artToolInfo}>
                <Text style={styles.artToolName}>{item.artName}</Text>
                {item.limitedTimeDeal > 0 ? (
                    <>
                        <Text style={styles.oldPrice}>${item.price.toFixed(2)}</Text>
                        <Text style={styles.newPrice}>${discountedPrice.toFixed(2)}</Text>
                        <Text style={styles.limitedDeal}>{item.limitedTimeDeal * 100}% OFF</Text>
                    </>
                ) : (
                    <Text style={styles.artToolPrice}>${item.price.toFixed(2)}</Text>
                )}
            </View>
            <View style={styles.favoriteButtonContainer}>
                <FavoriteButton isFavorite={isFavorite} onPress={() => toggleFavorite(item)} />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        margin: 5,
        padding: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 5,
        alignItems: 'center',
        position: 'relative',
    },
    artToolImage: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    artToolInfo: {
        marginTop: 10,
        alignItems: 'center',
    },
    artToolName: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        marginBottom: 5,
    },
    oldPrice: {
        fontSize: 16,
        color: '#888',
        textDecorationLine: 'line-through', // Strikethrough for old price
        marginBottom: 5,
    },
    newPrice: {
        fontSize: 22,
        color: '#e63946', // Highlight new price color
        fontWeight: '700',
        marginBottom: 5,
    },
    artToolPrice: {
        fontSize: 18,
        color: '#666',
        marginVertical: 5,
    },
    limitedDeal: {
        color: '#e63946',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 5,
    },
    favoriteButtonContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
});

export default ArtToolCard;
