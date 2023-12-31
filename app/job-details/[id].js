import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Stack, useRouter, useGlobalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from '../../components';
import { COLORS, SIZES, icons } from '../../constants';
import useFetch from '../../hook/useFetch';
import { GOOGLE_CAREER_PAGE_URL } from '../../constants/config';

const tabs = ['About', 'Qualifications', 'Responsibilities'];

const JobDetails = () => {
  const params = useGlobalSearchParams();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useFetch('job-details', {
    job_id: params.id,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  const displayTabContent = () => {
    switch (activeTab) {
      case 'About':
        return (
          <JobAbout info={data[0].job_description ?? 'No data provided'} />
        );
      case 'Qualifications':
        return (
          <Specifics
            title="Qualifications"
            points={data[0].job_highlights?.Qualifications ?? ['N/A']}
          />
        );
      case 'Responsibilities':
        return (
          <Specifics
            title="Responsibilities"
            points={data[0].job_highlights?.Responsibilities ?? ['N/A']}
          />
        );
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.lightWhite,
            elevation: 0,
          },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTitle: () => (
            <Text style={{ fontSize: SIZES.h2 }}>Job Details</Text>
          ),
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              iconUrl={icons.share}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
        }}
      />

      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={{
              padding: SIZES.medium,
              paddingBottom: 100,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : error ? (
              <Text>{error}</Text>
            ) : data.length === 0 ? (
              <Text>No data</Text>
            ) : (
              <>
                <Company
                  companyLogo={data[0].employer_logo}
                  jobTitle={data[0].job_title}
                  companyName={data[0].employer_name}
                  location={data[0].job_country}
                />
                <JobTabs
                  tabs={tabs}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />

                {displayTabContent()}
              </>
            )}
          </View>
        </ScrollView>

        <JobFooter
          url={
            data[0]?.job_apply_link ??
            data[0]?.job_google_link ??
            GOOGLE_CAREER_PAGE_URL
          }
        />
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
