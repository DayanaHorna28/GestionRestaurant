import './app.css'
import App from './App.svelte';
import 'alertifyjs/build/css/alertify.css';           // Importa los estilos principales de AlertifyJS
import 'alertifyjs/build/css/themes/default.min.css'; // Importa el tema de AlertifyJS
import alertify from 'alertifyjs';                    // Importa la funcionalidad de AlertifyJS

// Puedes configurar alertify de manera global aquí, si lo necesitas.
alertify.set('notifier', 'position', 'bottom-right');    // Configura la posición de las notificaciones, por ejemplo.


const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;