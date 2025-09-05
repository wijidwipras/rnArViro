import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {BottomNavigation, BottomNavigationTab, Layout} from '@ui-kitten/components';
import HomeScreen from './HomeScreen';
import HelpScreen from './HelpScreen';
import ProfileScreen from './ProfileScreen';
import {HomeIcon, QuestionMarkCircleIcon, UserIcon} from 'react-native-heroicons/outline';

const MainTabs = ({navigation, route}: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (route?.params?.tab !== undefined && typeof route.params.tab === 'number') {
      setSelectedIndex(route.params.tab);
    }
  }, [route?.params?.tab]);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return <HomeScreen navigation={navigation} />;
      case 1:
        return <HelpScreen />;
      case 2:
      default:
        return <ProfileScreen />;
    }
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>
      <BottomNavigation
        style={styles.bottomNav}
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}>
        <BottomNavigationTab title="Home" icon={() => <HomeIcon size={22} color={selectedIndex === 0 ? '#FFBF1B' : '#8F9BB3'} />} />
        <BottomNavigationTab title="Help" icon={() => <QuestionMarkCircleIcon size={22} color={selectedIndex === 1 ? '#FFBF1B' : '#8F9BB3'} />} />
        <BottomNavigationTab title="Profile" icon={() => <UserIcon size={22} color={selectedIndex === 2 ? '#FFBF1B' : '#8F9BB3'} />} />
      </BottomNavigation>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {flex: 1},
  bottomNav: {},
});

export default MainTabs;

