import {
  Switch, useMantineColorScheme, useMantineTheme,
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons';

export default function ThemeSwitcher() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const onChange = () => { toggleColorScheme(); };

  return (
    <Switch
      checked={colorScheme === 'dark'}
      onChange={onChange}
      size="lg"
      styles={{ root: { display: 'flex' } }}
      onLabel={<IconSun color={theme.white} size={20} stroke={1.5} />}
      offLabel={<IconMoonStars color={theme.colors.gray[6]} size={20} stroke={1.5} />}
    />
  );
}
