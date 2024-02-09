import RepositoryImpl from '@api/impl/repo/taskDS';
import FirebaseDS from '@api/impl/datasource/taskDS';

export const RepositoryData = new RepositoryImpl(new FirebaseDS());
