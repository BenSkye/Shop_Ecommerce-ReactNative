import React, { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

const RefreshableScrollView = ({ onFresh, children }) => {
    const [refreshing, setRefreshing] = useState(false);

    const onFreshHandler = () => {
        setRefreshing(true);
        onFresh().then(() => setRefreshing(false));
    };

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onFreshHandler}
                />
            }
        >
            {children}
        </ScrollView>
    );


}

export default RefreshableScrollView;