import React from 'react';

import './style.css';

function NavigationToggle() {
  return (
    <svg
      width="21"
      height="16"
      aria-hidden="true"
      data-icon="true"
      viewBox="0 0 21 16"
    >
      <path d="M20.77 7v2h-20V7zm0 7v2h-20v-2zM.77 2V0h20v2z" />
      <title>navigation toggle</title>
    </svg>
  );
}

export default React.memo(NavigationToggle);
