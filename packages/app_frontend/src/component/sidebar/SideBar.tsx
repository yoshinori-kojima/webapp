import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import {
  Box,
  Drawer,
  Toolbar,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
//jotai
import { useAtom } from 'jotai';
import { expandedAtom } from '../../atom';
//api
import { MenuGetPramas } from '../../../../shared/src/data/api/models/apiModels';
//data
import { FuncTreeNode } from '../../../../shared/src/data/dataCommon';

const drawerWidth = 250;

//Treeのスタイル
const simpleTreeStyles = {
  //height: 300,
  flexGrow: 1,
  maxWidth: 200,
  overflowY: 'auto',
  marginLeft:2
};
const treeItemStyles = {
  '& .MuiTreeItem-label': {
     fontWeight : 'bold'
    ,fontSize   : '1.0em'
  },
  '& .MuiTreeItem-content': {
    padding: 1,
  },
};

const SideBar = () => {
  const navigate = useNavigate();
  //モバイル端末判定
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);        // temporary variant 用の開閉状態
  //メニューリスト
  const [menulist, setMenuList] = useState<FuncTreeNode[]>([]);
  const [expanded, setExpanded] = useAtom(expandedAtom);

  useEffect( () => {
    const getMenu = async() => {
      // Getパラメータを設定
      const params : MenuGetPramas = { roleId: 1, };
      const queryString = new URLSearchParams(Object.entries(params)).toString(); //Object.entriesでオブジェクトを配列に変換

      const response = await fetch("/api/menu?" + `${queryString}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'credentials': 'include' // クッキーを含めるために必要
        },
      }).then(response =>{
        return response.json();
      }).catch((e: DOMException) => alert("error" + ":" + e.message));
      //メニューリストをセット
      await setMenuList(response.data.menu);
    };
    getMenu();
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //リンククリック時にSimpleTreeViewの展開を止める
  const handleLinkClick=(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.stopPropagation();
  }
  const handleToggle = (event: React.SyntheticEvent, itemId: string, isExpanded: boolean) => {
    if(isExpanded){
      //展開時
      setExpanded((prev) => [...prev, itemId]); //展開状態を更新
    }else{
      //折りたたみ時
      setExpanded((prev) => prev.filter((item) => item !== itemId)); //展開状態を更新
    }
  };

  return (
  <>
    <Box sx={{ display: 'flex' }} justifyContent="flex-start">
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',      //ビューポートに対して固定
            top: theme.spacing(8),
            left: theme.spacing(2),
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      </Box>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'} // モバイル端末の場合は一時的なDrawerに変更
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle} // temporary variant の場合に必要
          ModalProps={{
            keepMounted: true, // パフォーマンス向上のため
          }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {   // このスタイルはDrawerコンポーネントのpaperクラスに適用される
            width: drawerWidth,       // Drawerの幅を設定
            boxSizing: "border-box",  // ボックスサイジングをborder-boxに設定
            //backgroundImage: `linear-gradient(to right bottom, #FFFFFF, #EEFFFF)`,
            background: '#EEEEEE',
          },
        }}
      >
        <Toolbar />
          <Box sx={{height: 800, mt:2}}>
            {/*トップページ */}
            <Box display="flex" justifyContent="flex-start" sx={{ml:6}} >
              <Link to="/Top"
                style={{
                   fontSize: '1.0em'
                  ,color:'black'
                  ,display:'block'
                  ,paddingRight: '100px'
                  ,paddingBottom: '10px'
                }}>
                トップページ
              </Link>
            </Box>
            {/*メニュー */}
            <SimpleTreeView aria-label="basic tree" sx={simpleTreeStyles}
              defaultExpandedItems={expanded}
              onItemExpansionToggle={handleToggle}>
              {menulist.map((subsys, index) => (
                <TreeItem sx={treeItemStyles}
                  label={<Box display="flex" justifyContent="flex-start" >{subsys.name}</Box>} itemId={subsys.id}>
                    {subsys.children ?
                      subsys.children.map((func, index) => (
                        <TreeItem sx={treeItemStyles}
                          label={<Box display="flex" justifyContent="flex-start">
                            <Link to={func.routes} style={{color: 'black'}} onClick={handleLinkClick}>{func.name}</Link>
                          </Box>} itemId={func.id}>
                        </TreeItem>
                        ))
                     : null}
                </TreeItem>
              ))}
            </SimpleTreeView>
          </Box>
      </Drawer>
  </>
  );
};

export default SideBar;