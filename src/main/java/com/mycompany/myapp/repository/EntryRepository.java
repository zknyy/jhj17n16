package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Entry;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Entry entity.
 *
 * When extending this class, extend EntryRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface EntryRepository extends EntryRepositoryWithBagRelationships, JpaRepository<Entry, Long> {
    default Optional<Entry> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Entry> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Entry> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct entry from Entry entry left join fetch entry.blog",
        countQuery = "select count(distinct entry) from Entry entry"
    )
    Page<Entry> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct entry from Entry entry left join fetch entry.blog")
    List<Entry> findAllWithToOneRelationships();

    @Query("select entry from Entry entry left join fetch entry.blog where entry.id =:id")
    Optional<Entry> findOneWithToOneRelationships(@Param("id") Long id);
}
