import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell
} from '@jupyterlab/application';

import { showDialog, Dialog } from '@jupyterlab/apputils';

import { NotebookPanel } from '@jupyterlab/notebook';
import { ISessionContext } from '@jupyterlab/apputils';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'my-kernel-dead-notify:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    const shell = app.shell as ILabShell;

    shell.currentChanged.connect(
      (
        _: ILabShell,
        change: ILabShell.IChangedArgs
      ) => {
        const { newValue } = change;

        if (!newValue || !(newValue instanceof NotebookPanel)) {
          return;
        }

        const sessionContext: ISessionContext | null = newValue.sessionContext;

        if (!sessionContext) {
          return;
        }

        sessionContext.statusChanged.connect((sender, status: string) => {
          if (status === 'dead') {
            // Показываем простое модальное окно с одной кнопкой
            showDialog({
              title: 'KERNEL DIED!',
              body: 'Ядро умерло (restart_limit=0 — авто-перезапуск отключён)',
              buttons: [
                Dialog.okButton({
                  label: 'OK'
                })
              ],
              hasClose: true,
              focusNodeSelector: 'button'
            });
          }
        });
      }
    );

    console.log('Kernel death notifier (simple modal) activated');
  }
};

export default plugin;