
### Open/Close Help Panel

You can invoke the openHelpPanel method available from the AppLayoutContext from your component (must be descendants of AppLayout component) to trigger open of the help panel programmatically. 

```jsx static
import { useAppLayoutContext } from 'aws-northstar/layouts/AppLayout';

...

const { openHelpPanel } = useAppLayoutContext();

...
    return (
        ...
        <Button onClick={() => openHelpPanel()}>Open Help Panel</Button>
        ...
    )
```

### Dynamically set Help Panel content

```jsx static
import AppLayout, { useAppLayoutContext } from 'aws-northstar/layouts/AppLayout';
import React from 'react';

const DynamicHelpPanelSubComponent: React.FunctionComponent<any> = ({ children }) => {
    const { setHelpPanelContent } = useAppLayoutContext();

    useEffect(() => {
        setHelpPanelContent(<div>Dynamic Content!</div>);
    }, [setHelpPanelContent]);

    return children;
};

export const DynamicHelpPanel = () => {
    return (
        <AppLayout header={<div>Header</div>}>
            <DynamicHelpPanelSubComponent>
                <div>Main content</div>
            </DynamicHelpPanelSubComponent>
        </AppLayout>
    );
};
```

### Examples

**More examples** are available on <a href="https://storybook.northstar.aws-prototyping.cloud/?path=/story/applayout" target="_blank">NorthStar Storybook</a>.

```jsx
import { useState, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import AppLayout, { Notification, useAppLayoutContext } from 'aws-northstar/layouts/AppLayout';
import Box from 'aws-northstar/layouts/Box';
import Header from 'aws-northstar/components/Header';
import SideNavigation, { SideNavigationItemType } from 'aws-northstar/components/SideNavigation';
import ColumnLayout, { Column } from 'aws-northstar/layouts/ColumnLayout';
import KeyValuePair from 'aws-northstar/components/KeyValuePair';
import Badge from 'aws-northstar/components/Badge';
import BreadcrumbGroup from 'aws-northstar/components/BreadcrumbGroup';
import HelpPanel from 'aws-northstar/components/HelpPanel';
import Link from 'aws-northstar/components/Link';
import Text from 'aws-northstar/components/Text';
import Heading from 'aws-northstar/components/Heading';
import Stack from 'aws-northstar/layouts/Stack';
import Button from 'aws-northstar/components/Button';

const header = <Header title="HelloWorld" />;
const navigationItems = [
    { type: SideNavigationItemType.LINK, text: 'Page 1', href: '/page1' },
    { type: SideNavigationItemType.LINK, text: 'Page 2', href: '/page2' },
    { type: SideNavigationItemType.LINK, text: 'Page 3', href: '/page3' },
    { type: SideNavigationItemType.LINK, text: 'Page 4', href: '/page4' },
    { type: SideNavigationItemType.DIVIDER },
    {
        type: SideNavigationItemType.LINK,
        text: 'Notifications',
        href: '/notifications',
        info: <Badge color="red" content="23"></Badge>,
    },
    {
        type: SideNavigationItemType.LINK,
        text: 'Documentation',
        href: 'https://docs.yoursite.com',
    }
];
const navigation = (
    <SideNavigation
        header={{
            href: '/',
            text: 'App name',
        }}
        items={navigationItems}
    />
);
const helpPanel = (
    <HelpPanel
        header="Help panel title (h2)"
        learnMoreFooter={[
            <Link href="/docs">Link to internal documentation</Link>,
            <Link href="https://www.yoursite.com">Link to external documentation</Link>,
        ]}
    >
        <Text variant="p">
            This is a paragraph with some <b>bold text</b> and also some <i>italic text.</i>
        </Text>
        <Heading variant="h4">h4 section header</Heading>
        <Heading variant="h5">h5 section header</Heading>
    </HelpPanel>
);
const splitPanel = (<ColumnLayout>
    <Column key="column1">
        <Stack>
            <KeyValuePair label="Distribution Id" value="SLCCSMWOHOFUY0"></KeyValuePair>
            <KeyValuePair label="Domain name" value="bbb.cloudfront.net"></KeyValuePair>
        </Stack>
    </Column>
    <Column key="column2">
        <Stack>
            <KeyValuePair label="Price class" value="Use only US, Canada, Europe, and Asia"></KeyValuePair>
            <KeyValuePair label="CNAMEs"></KeyValuePair>
        </Stack>
    </Column>
    <Column key="column3">
        <Stack>
            <KeyValuePair label="SSL certificate" value="Default CloudFront SSL certificate"></KeyValuePair>
            <KeyValuePair label="Custom SSL client support"></KeyValuePair>
            <KeyValuePair label="Logging" value="Off"></KeyValuePair>
        </Stack>
    </Column>
</ColumnLayout>);

const breadcrumbGroup = (
    <BreadcrumbGroup
        items={[
            {
                text: 'Home',
                href: '#home',
            },
            {
                text: 'Path1',
                href: '#path1',
            },
            {
                text: 'Path2',
                href: '#path2',
            },
            {
                text: 'Path3',
                href: '#path3',
            }
        ]}
    />
);
const defaultNotifications = [
    {
        id: '1',
        header: 'Successfully updated 4 orders',
        type: 'success',
        content: 'This is a success flash message.',
        dismissible: true,
    },
    {
        id: '2',
        header: 'Failed to update 1 order',
        type: 'error',
        content: 'This is a dismissible error message with a button.',
        buttonText: 'Retry',
        onButtonClick: () => console.log('Button clicked'),
        dismissible: true,
    },
    {
        id: '3',
        header: 'Warning',
        type: 'warning',
        content: 'This is warning content',
        dismissible: true,
    }
]; 

const MainContent = () => {
    const { openHelpPanel, 
        openSplitPanel,
        addNotification, 
        dismissNotifications } = useAppLayoutContext();
    
    const [ notificationId, setNotificationId ] = useState();
    
    const handleAddClick = useCallback(() => {
        const id = uuidv4();
        addNotification({
            id,
            type: 'success',
            header: `Your request ${id} is being processed`,
            dismissible: true,
        });
        setNotificationId(id);
    }, [addNotification]);

    const handleRemoveLastClick = useCallback(() => {
        notificationId && dismissNotifications(notificationId);
    }, [dismissNotifications, notificationId]);

    const handleRemoveAll = useCallback(() => {
        dismissNotifications();
    }, [dismissNotifications]);

    return (<Box bgcolor="grey.300" width="100%" height="800px">
            <Stack>
                Main Content
                <Button onClick={() => openHelpPanel()}>Open Help Panel</Button>
                <Button onClick={() => openHelpPanel(false)}>Close Help Panel</Button>
                 <Button onClick={() => {
                     openSplitPanel();
                }}>Open Split Panel</Button>
                <Button onClick={() => openSplitPanel(false)}>Close Split Panel</Button>
                <Button onClick={handleAddClick}>Add New Notification</Button>
                <Button onClick={handleRemoveLastClick}>Remove Last Added Notification</Button>
                <Button onClick={handleRemoveAll}>Remove All notifications</Button>
            </Stack>
        </Box>
    )
}

const [notifications, setNotifications] = useState(defaultNotifications);

const handleDismiss = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
};
<BrowserRouter>
    <AppLayout
        header={header}
        navigation={navigation}
        helpPanel={helpPanel}
        splitPanel={splitPanel}
        breadcrumbs={breadcrumbGroup}
        notifications={notifications.map(n => ({ ...n, onDismiss: () => handleDismiss(n.id) }))}
    >
        <MainContent/>
    </AppLayout>
</BrowserRouter>
```