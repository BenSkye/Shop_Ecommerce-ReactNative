import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FavoriteButtonProps {
    isFavorite: boolean;
    onPress: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onPress }) => {
    return (
        <Pressable onPress={onPress} style={{ marginTop: 10 }}>
            <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? 'red' : 'black'}
            />
        </Pressable>
    );
};

export default FavoriteButton;
