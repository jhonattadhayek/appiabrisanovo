import { useContext } from 'react';

import { AppContext } from 'contexts/appContext';

const useApp = () => useContext(AppContext);

export default useApp;
