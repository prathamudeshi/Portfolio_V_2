/**
 * profiles.ts — Online presence / platform profiles.
 *
 * GitHub populated from Portfolio source links.
 * LinkedIn, LeetCode, CodeChef: placeholders — update these URLs.
 */

export interface Profile {
  id: string;
  platform: string;
  username: string;
  url: string;
  icon: string;
  stat?: string;
  color: string;
}

const profiles: Profile[] = [
  {
    id: 'github',
    platform: 'GitHub',
    username: 'prathamudeshi',
    url: 'https://github.com/prathamudeshi',
    icon: '🐙',
    stat: 'Open source projects',
    color: '#333333',
  },
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    username: 'prathamudeshi',
    url: 'https://linkedin.com/in/prathamudeshi',  // ← UPDATE THIS
    icon: '💼',
    stat: 'Professional network',
    color: '#0A66C2',
  },
  {
    id: 'leetcode',
    platform: 'LeetCode',
    username: 'prathamudeshi',
    url: 'https://leetcode.com/prathamudeshi',  // ← UPDATE THIS
    icon: '🧩',
    stat: 'Problem solving',
    color: '#FFA116',
  },
  {
    id: 'codechef',
    platform: 'CodeChef',
    username: 'prathamudeshi',
    url: 'https://codechef.com/users/prathamudeshi',  // ← UPDATE THIS
    icon: '👨‍🍳',
    stat: 'Competitive coding',
    color: '#5B4638',
  },
];

export default profiles;
