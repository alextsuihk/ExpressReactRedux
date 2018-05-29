import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const renderLogin = () => (
  <Nav className="ml-auto" navbar>
    <NavItem>
      <NavLink className="btn btn-primary" tag={Link} to="/account/login">Login</NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/account/register">Register</NavLink>
    </NavItem>
  </Nav>
);

const categoryList = [
  {
    menu: 'Memory',
    brand: '闪存/内存',
    hash: Math.random().toString(16).substring(7),
    cateogry: 'memory',
  },
  {
    menu: 'LCD',
    brand: 'LCD',
    hash: Math.random().toString(16).substring(7),
    cateogry: 'lcd',
  },
  {
    menu: '手机平板套片',
    brand: '套片',
    hash: Math.random().toString(16).substring(7),
    cateogry: 'chipset',
  },
  {
    menu: '连接器',
    brand: '连接器',
    hash: Math.random().toString(16).substring(7),
    cateogry: 'connector',
  },
  {
    menu: 'ONLY memory for now',
    brand: 'Do NOT use',
    hash: Math.random().toString(16).substring(7),
    cateogry: 'do_not_use',
  },
];


export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNavbarOpen: false,
      isDropDownLoginOpen: false,
      isDropDownCategoryOpen: false,
      selectedCategory: 0,

    };

    this.toggleDropdownCategory = this.toggleDropdownCategory.bind(this);
    this.toggleDropdownLogin = this.toggleDropdownLogin.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
    this.renderGreeting = this.renderGreeting.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  logoutClick(e) {
    e.preventDefault();
    const { logUserOutFunction } = this.props;
    logUserOutFunction();
  }

  selectCategory(index) {
    this.setState({
      selectedCategory: index,
    });

    const { setCategoryFunction } = this.props;
    const { cateogry } = categoryList[index];
    setCategoryFunction(cateogry);
  }

  toggleDropdownCategory() {
    this.setState({
      isDropDownCategoryOpen: !this.state.isDropDownCategoryOpen,
    });
  }

  toggleDropdownLogin() {
    this.setState({
      isDropDownLoginOpen: !this.state.isDropDownLoginOpen,
    });
  }

  toggleNavbar() {
    this.setState({
      isNavbarOpen: !this.state.isNavbarOpen,
    });
  }

  renderCategory() {
    return (
      <Nav navbar>
        <NavItem>
          <span className="nav-link">
            <Dropdown
              isOpen={this.state.isDropDownCategoryOpen}
              toggle={this.toggleDropdownCategory}
            >
              <DropdownToggle
                caret
                color="dark"
                data-toggle="dropdownCategory"
              //for JS identification, to be implemented
              >
                产品总类
              </DropdownToggle>
              <DropdownMenu>
                { this.renderCategoryDropdownItems() }
              </DropdownMenu>
            </Dropdown>
          </span>
        </NavItem>
      </Nav>
    );
  }

  renderCategoryDropdownItems() {
    return categoryList.map((category, index) => (
      <DropdownItem key={category.hash}>
        <div role="none" onClick={() => this.selectCategory(index)}>{category.menu}</div>
      </DropdownItem>
    ));
  }


  renderGreeting(name) {
    return (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <span className="nav-link">
            <Dropdown isOpen={this.state.isDropDownLoginOpen} toggle={this.toggleDropdownLogin}>
              <DropdownToggle caret>
                Welcome, {name}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Header</DropdownItem>
                <DropdownItem disabled>Change Password</DropdownItem>
                <DropdownItem>Another Action</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={this.logoutClick}>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </span>
        </NavItem>
      </Nav>
    );
  }

  render() {
    const { isLoggedIn, nickname } = this.props.authentication;
    return (
      <header className="wrapper">
        <Navbar color="dark" className="navbar-dark" light expand="md">
          <NavbarToggler right="true" onClick={this.toggleNavbar} />
          <NavbarBrand tag={Link} to="/">{ categoryList[this.state.selectedCategory].brand }</NavbarBrand>
          <Collapse isOpen={this.state.isNavbarOpen} navbar>
            { this.renderCategory() }
            <Nav className="mr-auto" navbar>
              { isLoggedIn ?
                <NavItem>
                  <NavLink tag={Link} to="/dashboard">仪表板</NavLink>
                </NavItem>
              : null
              }
              { isLoggedIn ?
                <NavItem>
                  <NavLink tag={Link} to="/offer">我要卖货</NavLink>
                </NavItem>
              : null
              }
              <NavItem>
                <NavLink tag={Link} to="/inventory">仓库清单</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/quote">报价</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/datasheet">规格书</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/notice" disabled>公告</NavLink>
              </NavItem>
            </Nav>
            { isLoggedIn ? this.renderGreeting(nickname) : renderLogin() }
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
