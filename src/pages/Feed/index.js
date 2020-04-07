import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';

import { Post, Header, Avatar, Name, Description, Loading } from './styles';

import LazyImage from '../../components/LazyImage';

export default function Feed() {
     const [feed, setFeed] = useState([]);
     const [page, setPage] = useState(1);
     const [total, setTotal] = useState(0); // de registros
     const [loading, setLoading] = useState(false);
     const [refreshing, setRefreshing] = useState(false);
     const [viewable, setViewable] = useState([]);

     async function loadPage(pageNumber = page, shouldRefreshing = false) { // shouldRefreshing - true quando a página está sendo recarregada. descarta toda a lista atual e recarrega tudo novamente
          if (total && pageNumber > total) return; // se total é diferente de 0 (estado inicial)
          
          setLoading(true);

          const response = await fetch(
               `http://192.168.15.12:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`
          );
               
          const data = await response.json(); // trazer os dados no formato json
          const totalItems = response.headers.get('X-Total-Count');

          setTotal(Math.floor(totalItems / 5)); // número de páginas
          setFeed(shouldRefreshing ? data : [... feed, ... data]); // não substitui o feed, mas acrescenta as novas informações ao que já havia
          setPage(pageNumber + 1);

          setLoading(false);
     }

     useEffect(() => {
          loadPage();
     }, []);

     async function refreshList() {
          setRefreshing(true);

          await loadPage(1, true);

          setRefreshing(false);
     }

     const handleViewableChanged = useCallback(({ changed }) => { 
          setViewable(changed.map(({ item }) => item.id)); // changed: os novos itens
     }, []) 

     return (
     <View>
          <FlatList 
               data={feed}
               keyExtractor={post => String(post.id)}
               onEndReached={() => loadPage()} /* quando usuário chegar ao final da lista. tem parâmetros padrões */
               onEndReachedThreshold={0.1} /* em quantos % do final da lista o usuário precisa estar para que novos itens sejam carregados. 10% */
               ListFooterComponent={loading && <Loading /> } // quando os itens estiverem sendo carregados
               onRefresh={refreshList} // quando o usuário recarregar a lista (puxando para cima)
               onViewableItemsChanged={handleViewableChanged} // quando os itens visíveis em tela mudarem
               viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20 }} // começa a carregar quando 20% da imagem surge em tela
               refreshing={refreshing} // quando está acontecendo a ação de refresh, ou quando este já terminou (boolean)
               renderItem={({ item }) => (
                   <Post>
                        <Header>
                              <Avatar source={{ uri: item.author.avatar }} />
                              <Name>{item.author.name}</Name>
                        </Header>

                        <LazyImage 
                              shouldLoad={viewable.includes(item.id)} // verificar se a imagem é uma das masi recentes em tela
                              aspectRatio={item.aspectRatio} 
                              smallSource={{ uri: item.small }}
                              source={{ uri: item.image }} 
                         /> 

                        <Description>
                              <Name>{item.author.name}</Name> {item.description}
                        </Description>
                   </Post> 
               )}
          />
     </View>
     );
}


/* */