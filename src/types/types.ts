// Root stack navigator for managing stack screens
export type RootStackParamList = {
    // Allow navigation to 'Tabs' with an optional 'screen' parameter
    Tabs: {
        screen: keyof RootTabParamList; // Allows navigation to specific tabs (e.g., Home, Favorites)
    };
    Detail: undefined; // No params for the Detail screen
};

// Root tab navigator for managing individual tabs
export type RootTabParamList = {
    Home: undefined; // No params needed for the Home tab
    Favorites: undefined; // No params needed for the Favorites tab
};
