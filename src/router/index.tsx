import { createHashRouter, RouterProvider } from 'react-router-dom';

import ReadTags from '../pages/ReadTags';

const router = createHashRouter([
  {
    path: '/',
    element: <ReadTags />,
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
