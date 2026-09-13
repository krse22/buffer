import {
  Camera,
  MessageCircle,
  Users,
  Briefcase,
  Play,
  Music,
  Pin,
  Store,
  AtSign,
  Cloud,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import type { Service } from '@/contracts/channel';

type PlatformInfo = {
  icon: LucideIcon;
  name: string;
  color: string;
};

const platformMap: Record<Service, PlatformInfo> = {
  instagram: { icon: Camera, name: 'Instagram', color: '#E4405F' },
  twitter: { icon: MessageCircle, name: 'X', color: '#1DA1F2' },
  facebook: { icon: Users, name: 'Facebook', color: '#1877F2' },
  linkedin: { icon: Briefcase, name: 'LinkedIn', color: '#0A66C2' },
  youtube: { icon: Play, name: 'YouTube', color: '#FF0000' },
  tiktok: { icon: Music, name: 'TikTok', color: '#000000' },
  pinterest: { icon: Pin, name: 'Pinterest', color: '#E60023' },
  googlebusiness: { icon: Store, name: 'Google Business', color: '#4285F4' },
  mastodon: { icon: AtSign, name: 'Mastodon', color: '#6364FF' },
  threads: { icon: AtSign, name: 'Threads', color: '#000000' },
  bluesky: { icon: Cloud, name: 'Bluesky', color: '#0085FF' },
  startpage: { icon: Globe, name: 'Start Page', color: '#6366F1' },
};

export function getPlatformInfo(service: Service): PlatformInfo {
  return platformMap[service] ?? { icon: AtSign, name: service, color: '#6B7280' };
}

export function PlatformIcon({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  const { icon: Icon, color } = getPlatformInfo(service);
  return <Icon className={className} style={{ color }} />;
}
