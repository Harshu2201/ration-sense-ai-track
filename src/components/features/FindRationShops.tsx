
import { useState } from 'react';
import { SearchSection } from './find-ration-shops/SearchSection';
import { ShopsList } from './find-ration-shops/ShopsList';
import { EmptyState } from './find-ration-shops/EmptyState';
import { useShopSearch } from './find-ration-shops/hooks/useShopSearch';

export const FindRationShops = () => {
  const [location, setLocation] = useState('');
  const { 
    shops, 
    loading, 
    usingMockData, 
    getCurrentLocation, 
    handleSearch 
  } = useShopSearch();

  const onSearch = () => handleSearch(location);

  return (
    <div className="space-y-6">
      <SearchSection
        location={location}
        setLocation={setLocation}
        loading={loading}
        usingMockData={usingMockData}
        onSearch={onSearch}
        onGetCurrentLocation={getCurrentLocation}
      />

      <ShopsList shops={shops} usingMockData={usingMockData} />
      
      {shops.length === 0 && <EmptyState loading={loading} />}
    </div>
  );
};
