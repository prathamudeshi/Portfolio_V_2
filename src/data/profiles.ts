/**
 * profiles.ts — Your online presence / platform profiles.
 *
 * ✏️  EDIT THIS FILE to add/remove/update your profiles.
 *     Each entry appears as a badge in the Profiles panel.
 */

export interface Profile {
  id: string;
  platform: string;
  username: string;
  url: string;
  icon: string;            // emoji or SVG path (we use emoji for simplicity)
  stat?: string;           // e.g. "1500 rating", "200+ contributions"
  color: string;           // brand color hex
}

const profiles: Profile[] = [
  {
    id: 'github',
    platform: 'GitHub',
    username: 'your-github',
    url: 'https://github.com/your-github',
    icon: '🐙',
    stat: 'Placeholder',
    color: '#333333',
  },
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    username: 'your-linkedin',
    url: 'https://linkedin.com/in/your-linkedin',
    icon: '💼',
    stat: 'Placeholder',
    color: '#0A66C2',
  },
  {
    id: 'leetcode',
    platform: 'LeetCode',
    username: 'your-leetcode',
    url: 'https://leetcode.com/your-leetcode',
    icon: '🧩',
    stat: 'Placeholder rating',
    color: '#FFA116',
  },
  {
    id: 'codechef',
    platform: 'CodeChef',
    username: 'your-codechef',
    url: 'https://codechef.com/users/your-codechef',
    icon: '👨‍🍳',
    stat: 'Placeholder rating',
    color: '#5B4638',
  },
  // ✏️  Add more profiles here:
  // {
  //   id: 'twitter',
  //   platform: 'X (Twitter)',
  //   username: '@yourhandle',
  //   url: 'https://x.com/yourhandle',
  //   icon: '𝕏',
  //   color: '#000000',
  // },
];

export default profiles;
