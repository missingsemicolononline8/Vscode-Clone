import Files from './components/Files/ProjectFiles'
import { store } from './store/store';
import { Provider } from 'react-redux';
import Editor from './components/CodeEditor';



function App() {

  return (
    <section className='flex'>
      <Provider store={store}>
        <Files />
        <Editor />
      </Provider>
    </section>
  )
}

export default App
