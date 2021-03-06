import React, { ReactNode } from 'react';
import { Box, ThemeUICSSObject } from 'theme-ui';
import { MobileAndTablet, Desktop } from 'react-responsive-simple';
import { CgMenuGridO } from 'react-icons/cg';
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
import { MenuItemType } from '../../pages/landing-page/LandingPage';
export interface MenuProps {
  sx?: ThemeUICSSObject;
  schema: Record<'left' | 'right', MenuItemType[]>;
}

export interface MenuItemProps {
  onClick?: () => void;
  OnHover?: () => JSX.Element;
  children: ReactNode;
  sx?: ThemeUICSSObject;
  href: String;
  as: String;
}

export const Menu: React.FC<MenuProps> = ({ schema, sx }) => {
  return (
    <Box sx={{ width: '100%', '> div': { width: '100%' } }}>
      <Desktop>
        <MenuDesktop schema={schema} sx={sx} />
      </Desktop>

      <MobileAndTablet>
        <MenuMobile schema={schema} />
      </MobileAndTablet>
    </Box>
  );
};

export const MenuItem: React.FC<MenuItemProps> = ({
  onClick,
  children,
  sx,
  href,
  as,
}) => {
  return (
    <Box onClick={onClick} sx={{ position: 'relative' }}>
      <Box as="a" href={href} sx={{ ...sx, variant: 'styles.menuItem' }}>
        {children}
      </Box>
    </Box>
  );
};

export const MenuDesktop: React.FC<MenuProps> = ({ schema, sx }) => {
  const leftItems = schema.left;
  const rightItems = schema.right;

  return (
    <Box sx={{ ...sx, variant: 'styles.menu' }}>
      <Box sx={{ flexGrow: 1, display: 'inherit', ml: 3 }}>
        {leftItems &&
          leftItems.map((leftItem, _) => {
            return (
              <MenuItem as="a" href={leftItem.href} sx={{ ml: 5 }}>
                {leftItem.text || leftItem.icon}
              </MenuItem>
            );
          })}
      </Box>

      {rightItems &&
        rightItems.map((rightItem, _) => {
          return (
            <MenuItem as="a" href={rightItem.href} sx={{ ml: 5 }}>
              {rightItem.text || rightItem.icon}
            </MenuItem>
          );
        })}
    </Box>
  );
};

export const MenuMobile: React.FC<MenuProps> = ({ schema }) => {
  const [open, setOpen] = React.useState(false);

  const items = [...schema.left, ...schema.right];

  React.useEffect(() => {
    if (open) {
      disableBodyScroll(document.head);
    } else {
      clearAllBodyScrollLocks();
    }
  }, [open]);

  const onClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box
        onClick={onClick}
        sx={{
          position: 'relative',
          textAlign: 'right',
          cursor: 'pointer',
          zIndex: 9,
        }}
      >
        <CgMenuGridO size="30"></CgMenuGridO>
      </Box>

      {open && (
        <Box
          data-testid="menuOverlay"
          sx={{
            position: 'fixed',
            zIndex: 9,
            width: '100%',
            backgroundColor: 'white',
            maxHeight: '100vh',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        >
          <Box
            sx={{
              variant: 'styles.menu',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
            }}
          >
            {items.map((menuItem, _) => {
              return (
                <MenuItem sx={{ mt: 3, fontSize: 4 }}>{menuItem.text}</MenuItem>
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
};
