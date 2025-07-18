import AcLayoutAside from './Aside.vue';
import AcLayoutContent from './Content.vue';
import AcLayoutHeader from './Header.vue';
import AcLayout from './Layout.vue';
import AcLayoutSender from './Sender.vue';
AcLayout.install = (app) => {
    app.component('AcLayoutAside', AcLayoutAside);
    app.component('AcLayoutContent', AcLayoutContent);
    app.component('AcLayoutHeader', AcLayoutHeader);
    app.component('AcLayout', AcLayout);
    app.component('AcLayoutSender', AcLayoutSender);
};
export { AcLayoutAside, AcLayoutContent, AcLayoutHeader, AcLayout, AcLayoutSender };
