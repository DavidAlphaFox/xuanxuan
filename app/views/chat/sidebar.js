import React               from 'react';
import Theme               from '../../theme';
import {App, Lang, Config} from '../../app';
import CloseIcon           from 'material-ui/svg-icons/navigation/close';
import IconButton          from 'material-ui/IconButton';
import FlatButton          from 'material-ui/FlatButton';
import Tabs                from '../components/tabs';
import MembersList         from '../contacts/members-list';
import CacheContents       from '../mixins/cache-contents';
import FileList            from './file-list';
import Modal               from 'Components/modal';

const STYLE = {
    main: {
        borderLeft: '1px solid ' + Theme.color.border
    },
    header: {
        borderBottom: '1px solid ' + Theme.color.border, 
        padding: '10px 15px 10px 50px',
        lineHeight: '28px',
        height: 28,
        backgroundColor: Theme.color.pale2,
        zIndex: 9
    },
    tabsWrapper: {
        right: 48
    },
    content: {
        top: 49
    },
    tabContent: {
        padding: 8
    },
    tabList: {
        backgroundColor: Theme.color.canvas
    },
    exitButton: {
        display: 'block',
        width: '100%',
        color: Theme.color.negative
    }
};

let tabs = [
    {key: "members"},
    {key: "files"},
    // {label: '项目', key: "project"}
]

// display app component
const ChatSidebar = React.createClass({
    mixins: [CacheContents],

    getInitialState() {
        return {
            tab: tabs[0].key
        };
    },

    _handleCloseButtonClick() {
        return this.props.onCloseButtonClick && this.props.onCloseButtonClick();
    },

    _handOnTabClick(tab) {
        this.setState({tab});
    },

    getDisplayCacheContentId(cacheName) {
        return this.state.tab;
    },

    _handleMemberClick(member) {

        App.openProfile({member, inModal: true});
    },

    _handleExitChatButtonClick() {
        Modal.show({
            modal: true,
            closeButton: false,
            content: Lang.chat.exitChatConfirm.format(this.props.chat.getDisplayName(App)),
            width: 360,
            actions: [{type: 'cancel'}, {type: 'submit'}],
            onSubmit: () => {
                App.chat.exit(this.props.chat);
            }
        });
    },

    renderCacheContent(contentId, cacheName) {
        if(contentId === 'members') {
            let exitChatButtonView = null;
            if(this.props.chat.canExit) {
                exitChatButtonView = <div style={STYLE.tabContent}>
                  <div style={{backgroundColor: Theme.color.canvas}}><FlatButton label={Lang.chat.exitChat} onClick={this._handleExitChatButtonClick} style={STYLE.exitButton}/></div>
                </div>;
            }

            let members = this.props.chat.membersSet.sort((x, y) => y.orderCompareValue - x.orderCompareValue);
            if(!this.tabsNameAlias) this.tabsNameAlias = {};
            this.tabsNameAlias[contentId] = members.length;

            return <div>
              <MembersList onItemClick={this._handleMemberClick} size='small' members={members} style={STYLE.tabContent} listStyle={STYLE.tabList}/>
              {exitChatButtonView}
            </div>
        } else if(contentId === 'files') {
            return <FileList
                    style={STYLE.tabContent}
                    chatId={this.props.chat.gid}
                    onFilesLoad={files => {
                        if(!this.tabsNameAlias) this.tabsNameAlias = {};
                        this.tabsNameAlias[contentId] = files.length;
                    }}
            />
        } else {
            return <div style={STYLE.tabContent}>Tab - {contentId}</div>
        }
    },

    render() {
        let {
            style,
            chat,
            ...other
        } = this.props;

        let tabsContents = this.renderCacheContents();

        tabs.forEach(tab => {
            tab.label = Lang.chat.sidebar.tabs[tab.key];
            if(this.tabsNameAlias[tab.key]) tab.label += ' (' + this.tabsNameAlias[tab.key] + ')';
        });

        style = Object.assign({}, STYLE.main, style);

        return <div {...other} style={style}>
          <header className='dock-top' style={STYLE.header}>
            <div className='dock-left' style={STYLE.tabsWrapper}>
              <Tabs onTabClick={this._handOnTabClick} tabs={tabs} selected={this.state.tab}>
              </Tabs>
            </div>
            <div className='dock-right'>
              <IconButton className="hint--left" onClick={this._handleCloseButtonClick} data-hint={Lang.chat.closeSidebar}><CloseIcon color={Theme.color.icon} hoverColor={Theme.color.primary1}/></IconButton>
            </div>
          </header>
          <div className='dock-full scroll-y' style={STYLE.content}>
            {tabsContents}
          </div>
        </div>
    }
});

export default ChatSidebar;
