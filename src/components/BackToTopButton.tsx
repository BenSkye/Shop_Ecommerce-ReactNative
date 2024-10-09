import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface BackToTopButtonProps {
    onPress: () => void;
    style?: ViewStyle;
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ onPress, style }) => {
    return (
        <Pressable style={[styles.button, style]} onPress={onPress}>
            <Icon name="arrow-up" size={20} color="#fff" />
        </Pressable>
    );
};

export default BackToTopButton;

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
        padding: 15,
        borderRadius: 50, // Circular button
        elevation: 5, // Shadow for elevation
        justifyContent: 'center',
        alignItems: 'center',
    },
});
