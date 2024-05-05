export class SideMenuHelper {

    static getSideMenu() {
      const sideMenu = [
        {
          iconName: 'home', displayText: 'Home', expanded: false, hasChild: false, url: '/tabs'
        },
        {
          iconName: 'file-tray-full-outline', displayText: 'Perfil', expanded: true, hasChild: true,
          subOptions: [
            { iconName: 'id-card-outline', displayText: 'Meu Perfil', url: '/profile' },
            { iconName: 'pencil', displayText: 'Registro', url: '/signup' },
            { iconName: 'settings', displayText: 'Configrações', url: '/configs' },
          ]
        },
        {
          iconName: 'file-tray-full-outline', displayText: 'Clientes', expanded: true, hasChild: true,
          subOptions: [
            { iconName: 'people', displayText: 'Listar', url: '/clients' },
            { iconName: 'layers', displayText: 'Novo', url: '/client' },
          ]
        }
      ];
      return sideMenu;
    }
  }
  